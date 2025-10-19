// src/app/api/orders/route.js
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function mapPaymentMethod(payment) {
	// Map UI selection to enum values in DB
	const p = String(payment || '').toLowerCase();
	if (p === 'cod') return 'cod';
	if (p === 'transfer') return 'transfer';
	if (p === 'qris' || p === 'ewallet' || p === 'wallet') return 'ewallet';
	return 'other';
}

function generateOrderCode() {
	const now = new Date();
	const y = now.getFullYear();
	const m = String(now.getMonth() + 1).padStart(2, '0');
	const d = String(now.getDate()).padStart(2, '0');
	const time = `${now.getHours()}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
	const rand = Math.floor(Math.random() * 9000 + 1000);
	return `ORD-${y}${m}${d}-${time}-${rand}`;
}

export async function POST(req) {
	const supabase = await createSupabaseServerClient();

	// Auth required (we use cart_items by user_id)
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	let body;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const address_id = body?.address_id ? String(body.address_id) : null;
	let name = String(body?.name || '').trim();
	let phone = String(body?.phone || '').trim();
	let address = String(body?.address || '').trim();
	let note = String(body?.note || '').trim();
	const payment_method = mapPaymentMethod(body?.payment);

	// If address_id provided, load it and override fields
	if (address_id) {
		const { data: addr, error: addrErr } = await supabase.from('addresses').select('*').eq('id', address_id).single();
		if (addrErr || !addr) {
			return NextResponse.json({ error: 'Alamat tidak ditemukan.' }, { status: 400 });
		}
		name = addr.recipient_name || name;
		phone = addr.phone || phone;
		address = addr.address || address;
		note = addr.note || note;
	}

	if (!name || !phone || !address) {
		return NextResponse.json({ error: 'Nama, nomor HP, dan alamat wajib diisi.' }, { status: 400 });
	}

	try {
		// 1) Upsert customer by unique phone
		const { data: customer, error: custErr } = await supabase.from('customers').upsert({ user_id: user.id, name, phone, address, note }, { onConflict: 'user_id,phone' }).select().single();
		if (custErr) {
			console.error('Customer upsert error:', custErr);
			return NextResponse.json({ error: 'Gagal menyimpan pelanggan.' }, { status: 500 });
		}

		// 2) Load cart items for this user
		const { data: cartItems, error: cartErr } = await supabase.from('cart_items').select('*').eq('user_id', user.id);
		if (cartErr) {
			console.error('Cart load error:', cartErr);
			return NextResponse.json({ error: 'Gagal memuat keranjang.' }, { status: 500 });
		}
		if (!cartItems || cartItems.length === 0) {
			return NextResponse.json({ error: 'Keranjang kosong.' }, { status: 400 });
		}

		const productIds = cartItems.map((c) => c.product_id).filter(Boolean);
		const numericIds = productIds
			.map((id) => {
				const n = Number(id);
				return Number.isFinite(n) ? n : null;
			})
			.filter((n) => n !== null);

		// 3) Fetch product snapshots
		const { data: products, error: prodErr } = await supabase.from('Products').select('*').in('id', numericIds);
		if (prodErr) {
			console.error('Products fetch error:', prodErr);
			return NextResponse.json({ error: 'Gagal memuat produk.' }, { status: 500 });
		}

		const productById = Object.fromEntries((products || []).map((p) => [String(p.id), p]));

		// 4) Build order items snapshot from cart + products
		const orderItems = [];
		let subtotal = 0;
		for (const ci of cartItems) {
			const p = productById[String(Number(ci.product_id))] || productById[String(ci.product_id)];
			if (!p) continue; // skip missing products
			const qty = Math.max(1, ci.quantity || 1);
			const price = Number(p.harga || 0);
			const lineSubtotal = price * qty;
			subtotal += lineSubtotal;
			orderItems.push({
				product_id: String(p.id),
				name: p.nama,
				price: price,
				qty: qty,
				subtotal: lineSubtotal,
			});
		}

		if (orderItems.length === 0) {
			return NextResponse.json({ error: 'Tidak ada item valid di keranjang.' }, { status: 400 });
		}

		const total = subtotal; // apply shipping/discounts here if any
		const order_code = generateOrderCode();

		// 5) Create order
		const { data: order, error: orderErr } = await supabase
			.from('orders')
			.insert({
				order_code,
				customer_id: customer.id,
				payment_method,
				status: 'CONFIRMED',
				subtotal,
				total,
				user_id: user.id,
			})
			.select()
			.single();
		if (orderErr) {
			console.error('Order insert error:', orderErr);
			return NextResponse.json({ error: 'Gagal membuat pesanan.' }, { status: 500 });
		}

		// 6) Insert order_items
		const itemsWithOrderId = orderItems.map((it) => ({ ...it, order_id: order.id }));
		const { error: oiErr } = await supabase.from('order_items').insert(itemsWithOrderId);
		if (oiErr) {
			console.error('Order items insert error:', oiErr);
			return NextResponse.json({ error: 'Gagal menyimpan item pesanan.' }, { status: 500 });
		}

		// 7) Clear cart
		const { error: clearErr } = await supabase.from('cart_items').delete().eq('user_id', user.id);
		if (clearErr) {
			console.warn('Cart clear warning:', clearErr);
			// do not fail the whole request
		}

		return NextResponse.json(
			{
				success: true,
				order: {
					id: order.id,
					order_code: order.order_code,
					subtotal,
					total,
					status: order.status,
					created_at: order.created_at,
				},
			},
			{ status: 201 }
		);
	} catch (err) {
		console.error('Checkout unexpected error:', err);
		return NextResponse.json({ error: 'Terjadi kesalahan tak terduga.' }, { status: 500 });
	}
}
