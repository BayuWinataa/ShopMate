// src/app/api/addresses/route.js
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const { data, error } = await supabase.from('addresses').select('*').order('created_at', { ascending: false });
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ data });
}

export async function POST(req) {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	let body;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const label = String(body?.label || 'Utama').slice(0, 100);
	const recipient_name = String(body?.recipient_name || '').trim();
	const phone = String(body?.phone || '').trim();
	const address = String(body?.address || '').trim();
	const note = body?.note ? String(body.note).trim() : null;

	if (!recipient_name || !phone || !address) {
		return NextResponse.json({ error: 'Nama penerima, nomor HP, dan alamat wajib diisi.' }, { status: 400 });
	}

	const { data, error } = await supabase.from('addresses').insert({ user_id: user.id, label, recipient_name, phone, address, note }).select().single();
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ data }, { status: 201 });
}
