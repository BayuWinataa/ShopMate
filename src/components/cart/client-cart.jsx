'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const formatIDR = (n) =>
	new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0,
	}).format(Number.isFinite(n) ? n : 0);

function useDebouncedCallback(cb, delay = 250) {
	const t = useRef();
	return (...args) => {
		clearTimeout(t.current);
		t.current = setTimeout(() => cb(...args), delay);
	};
}

export default function ClientCartPage() {
	const { items, updateQty, removeItem, clear, totalPrice } = useCart();
	const router = useRouter();
	const supabase = createSupabaseBrowserClient();

	const [open, setOpen] = useState(false);
	const [placing, setPlacing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);

	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [note, setNote] = useState('');
	const [payment, setPayment] = useState('qris');
	const [addresses, setAddresses] = useState([]);
	const [addressId, setAddressId] = useState('');
	const [addressMode, setAddressMode] = useState('manual'); // 'manual' | 'saved'

	// Check authentication
	useEffect(() => {
		(async () => {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (!user) {
					router.replace('/login');
					return;
				}
				setUser(user);
			} catch (error) {
				console.error('Auth check error:', error);
				router.replace('/login');
			} finally {
				setLoading(false);
			}
		})();
	}, [supabase, router]);

	useEffect(() => {
		try {
			const raw = localStorage.getItem('checkoutForm');
			if (raw) {
				const saved = JSON.parse(raw);
				setName(saved.name ?? '');
				setPhone(saved.phone ?? '');
				setAddress(saved.address ?? '');
				setNote(saved.note ?? '');
				setPayment(saved.payment ?? 'qris');
				setAddressMode(saved.addressMode ?? 'manual');
				setAddressId(saved.addressId ?? '');
			}
		} catch {}
	}, []);

	useEffect(() => {
		try {
			localStorage.setItem('checkoutForm', JSON.stringify({ name, phone, address, note, payment, addressMode, addressId }));
		} catch {}
	}, [name, phone, address, note, payment, addressMode, addressId]);

	// Load saved addresses when modal opens
	useEffect(() => {
		if (!open) return;
		(async () => {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (!user) return;
				const res = await fetch('/api/addresses');
				if (!res.ok) return;
				const json = await res.json();
				setAddresses(Array.isArray(json.data) ? json.data : []);
			} catch (e) {
				console.warn('Failed to load addresses', e);
			}
		})();
	}, [open, supabase]);

	const debouncedUpdateQty = useDebouncedCallback((id, qty) => {
		const clamped = Math.max(1, Number.isFinite(qty) ? qty : 1);
		updateQty(id, clamped);
	}, 200);

	const inc = (it) => updateQty(it.id, (it.qty || 1) + 1);
	const dec = (it) => updateQty(it.id, Math.max(1, (it.qty || 1) - 1));

	// Show loading while checking auth
	if (loading) {
		return (
			<div className="mt-10 flex items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-violet-600"></div>
			</div>
		);
	}

	// Don't render if no user (will redirect)
	if (!user) {
		return null;
	}

	if (!items.length) {
		return (
			<div className="mt-10 flex flex-col items-center justify-center rounded-xl border bg-muted/20 p-10 text-center">
				<ShoppingCart className="mb-3 h-8 w-8 text-muted-foreground" />
				<p className="text-sm text-muted-foreground">Keranjang kamu masih kosong.</p>
				<Button asChild className="mt-4">
					<Link href="/products">Mulai belanja</Link>
				</Button>
				<Toaster />
			</div>
		);
	}

	const handlePlaceOrder = async (e) => {
		e?.preventDefault?.();

		if (addressMode === 'saved') {
			if (!addressId) {
				toast.error('Pilih alamat tersimpan dulu.');
				return;
			}
		} else if (!name.trim() || !phone.trim() || !address.trim()) {
			toast.error('Nama, nomor HP, dan alamat wajib diisi.');
			return;
		}

		// Validasi nomor HP hanya untuk mode manual
		if (addressMode === 'manual') {
			if (!/^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(phone.replace(/\s|-/g, ''))) {
				toast.error('Nomor HP tidak valid.');
				return;
			}
		}

		try {
			setPlacing(true);

			// Call server API to create order in Supabase
			const res = await fetch('/api/orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(addressMode === 'saved' ? { address_id: addressId, payment } : { name, phone, address, note, payment }),
			});

			if (!res.ok) {
				const msg = await res.json().catch(() => ({}));
				throw new Error(msg?.error || 'Gagal membuat pesanan.');
			}

			const data = await res.json();

			await clear();
			localStorage.removeItem('checkoutForm');

			toast.success(`Pesanan ${data?.order?.order_code || ''} berhasil dibuat!`);
			setOpen(false);
			router.push('/dashboard/orders?success=1');
		} catch (err) {
			console.error(err);
			toast.error(err.message || 'Gagal membuat pesanan. Silakan coba lagi.');
		} finally {
			setPlacing(false);
		}
	};

	return (
		<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
			{/* List item */}
			<div className="space-y-4 lg:col-span-2">
				{items.map((it) => (
					<div key={it.id} className="rounded-xl border p-4">
						<div className="flex items-start gap-4">
							<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
								{it.image ? <Image src={it.image} alt={it.nama} fill className="object-cover" /> : <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">No Image</div>}
							</div>

							<div className="min-w-0 flex-1">
								<div className="flex items-start justify-between gap-3">
									<div className="truncate">
										<div className="truncate text-sm font-medium">{it.nama}</div>
										<div className="text-xs text-muted-foreground">{formatIDR(it.harga)}</div>
									</div>

									<button aria-label="Hapus item" className="text-muted-foreground transition-colors hover:text-red-600" onClick={() => removeItem(it.id)}>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>

								<div className="mt-3 flex items-center gap-3">
									<span className="text-xs text-muted-foreground">Qty</span>
									<div className="flex items-center rounded-lg border">
										<Button type="button" variant="ghost" className="h-8 w-8 rounded-none" onClick={() => dec(it)} aria-label="Kurangi qty">
											<Minus className="h-3.5 w-3.5" />
										</Button>
										<Input
											type="number"
											inputMode="numeric"
											min={1}
											value={it.qty}
											onChange={(e) => debouncedUpdateQty(it.id, Number(e.target.value || 1))}
											className="h-8 w-16 border-0 text-center focus-visible:ring-0"
											aria-label={`Jumlah untuk ${it.nama}`}
										/>
										<Button type="button" variant="ghost" className="h-8 w-8 rounded-none" onClick={() => inc(it)} aria-label="Tambah qty">
											<Plus className="h-3.5 w-3.5" />
										</Button>
									</div>
									<div className="ml-auto text-sm font-semibold">{formatIDR((it.harga || 0) * (it.qty || 1))}</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Ringkasan */}
			<div className="lg:col-span-1">
				<div className="sticky top-20 rounded-xl border p-4">
					<div className="space-y-2 text-sm">
						<div className="flex items-center justify-between text-base">
							<span className="font-medium">Total</span>
							<span className="font-extrabold">{formatIDR(totalPrice)}</span>
						</div>
					</div>

					<div className="mt-4 flex gap-2">
						<Button className="flex-1" onClick={() => setOpen(true)}>
							Lanjut Checkout
						</Button>
						<Button variant="outline" onClick={() => clear()}>
							Kosongkan
						</Button>
					</div>
				</div>
			</div>

			{/* Modal Checkout */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Checkout</DialogTitle>
					</DialogHeader>

					<form onSubmit={handlePlaceOrder} className="space-y-4">
						<div className="grid grid-cols-1 gap-3">
							{/* Mode address */}
							<div className="grid gap-1.5">
								<Label>Alamat</Label>
								<div className="flex gap-2">
									<Button type="button" variant={addressMode === 'manual' ? 'default' : 'outline'} onClick={() => setAddressMode('manual')}>
										Manual
									</Button>
									<Button type="button" variant={addressMode === 'saved' ? 'default' : 'outline'} onClick={() => setAddressMode('saved')}>
										Pilih Tersimpan
									</Button>
								</div>
							</div>

							{addressMode === 'saved' ? (
								<div className="grid gap-1.5">
									<Label>Pilih Alamat Tersimpan</Label>
									<Select value={addressId} onValueChange={setAddressId}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Pilih alamat" />
										</SelectTrigger>
										<SelectContent align="start">
											{addresses.length === 0 ? (
												<SelectItem value="__no_addresses" disabled>
													Tidak ada alamat tersimpan
												</SelectItem>
											) : (
												addresses.map((a) => (
													<SelectItem key={a.id} value={a.id}>
														{a.label || 'Alamat'} — {a.recipient_name} — {a.phone}
													</SelectItem>
												))
											)}
										</SelectContent>
									</Select>
									{/* Preview alamat terpilih */}
									{addressId && addresses.find((a) => a.id === addressId) ? (
										<div className="mt-3 rounded-lg border p-3 text-sm">
											{(() => {
												const a = addresses.find((x) => x.id === addressId);
												if (!a) return null;
												return (
													<div className="space-y-1">
														<div className="font-medium">
															{a.recipient_name} • {a.phone}
														</div>
														<div className="whitespace-pre-wrap">{a.address}</div>
														{a.note ? <div className="text-muted-foreground">Catatan: {a.note}</div> : null}
													</div>
												);
											})()}
										</div>
									) : null}
								</div>
							) : (
								<>
									<div className="grid gap-1.5">
										<Label htmlFor="name">Nama Penerima</Label>
										<Input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" required />
									</div>
									<div className="grid gap-1.5">
										<Label htmlFor="phone">No. HP</Label>
										<Input id="phone" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxx" required />
									</div>
									<div className="grid gap-1.5">
										<Label htmlFor="address">Alamat</Label>
										<Textarea id="address" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Jalan, Kelurahan, Kecamatan, Kota, Kode Pos" required />
									</div>
									<div className="grid gap-1.5">
										<Label htmlFor="note">Catatan (opsional)</Label>
										<Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Mis: Titip di satpam" />
									</div>
									<div>
										<Button
											type="button"
											variant="outline"
											onClick={async () => {
												try {
													if (!name.trim() || !phone.trim() || !address.trim()) {
														toast.error('Isi nama, HP, dan alamat terlebih dulu.');
														return;
													}
													const res = await fetch('/api/addresses', {
														method: 'POST',
														headers: { 'Content-Type': 'application/json' },
														body: JSON.stringify({ label: 'Alamat', recipient_name: name, phone, address, note }),
													});
													const out = await res.json();
													if (!res.ok) throw new Error(out?.error || 'Gagal menyimpan alamat');
													// Refresh list and select the new one
													setAddresses((prev) => [out.data, ...prev]);
													setAddressId(out.data.id);
													setAddressMode('saved');
													toast.success('Alamat disimpan.');
												} catch (err) {
													toast.error(err.message || 'Gagal menyimpan alamat');
												}
											}}
										>
											Simpan Alamat Ini
										</Button>
									</div>
								</>
							)}
							<div className="grid gap-1.5">
								<Label>Metode Pembayaran</Label>
								<div className="grid grid-cols-3 gap-2">
									{['qris', 'transfer', 'cod'].map((opt) => (
										<button
											key={opt}
											type="button"
											onClick={() => setPayment(opt)}
											className={['rounded-lg border px-3 py-2 text-sm transition-colors', payment === opt ? 'border-primary bg-primary/10 text-primary' : 'border-input hover:bg-muted'].join(' ')}
											aria-pressed={payment === opt}
											aria-label={`Pilih ${opt.toUpperCase()}`}
										>
											{opt.toUpperCase()}
										</button>
									))}
								</div>
							</div>
							<div className="rounded-lg border p-3 text-sm">
								<div className="flex items-center justify-between">
									<span>Total Dibayar</span>
									<span className="font-bold">{formatIDR(totalPrice)}</span>
								</div>
							</div>
						</div>
						<DialogFooter className="gap-2 sm:gap-0">
							<Button type="button" variant="outline" onClick={() => setOpen(false)}>
								Batal
							</Button>
							<Button type="submit" disabled={placing}>
								{placing ? 'Memproses…' : 'Buat Pesanan'}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
			<Toaster />
		</div>
	);
}
