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

const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);

// Spinner kecil (tema violet)
const Spinner = ({ className = 'h-4 w-4 text-violet-600' }) => (
	<svg className={`animate-spin ${className}`} viewBox="0 0 24 24" aria-hidden>
		<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
		<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
	</svg>
);

// Skeleton Loading Component
const CartSkeleton = () => (
	<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
		{/* List items skeleton */}
		<div className="space-y-4 lg:col-span-2">
			{[1, 2, 3].map((i) => (
				<div key={i} className="rounded-xl border border-violet-200 bg-white p-4 shadow-sm animate-pulse">
					<div className="flex items-start gap-4">
						<div className="h-16 w-16 shrink-0 rounded-lg bg-violet-100" />
						<div className="min-w-0 flex-1 space-y-3">
							<div className="space-y-2">
								<div className="h-4 w-3/4 bg-violet-100 rounded" />
								<div className="h-3 w-1/4 bg-violet-100 rounded" />
							</div>
							<div className="flex items-center gap-3">
								<div className="h-8 w-32 bg-violet-100 rounded-lg" />
								<div className="ml-auto h-4 w-20 bg-violet-100 rounded" />
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
		{/* Summary skeleton */}
		<div className="lg:col-span-1">
			<div className="sticky top-20 rounded-xl border border-violet-200 bg-white p-4 shadow-sm animate-pulse">
				<div className="space-y-3">
					<div className="h-6 w-full bg-violet-100 rounded" />
					<div className="h-10 w-full bg-violet-100 rounded" />
					<div className="h-10 w-full bg-violet-100 rounded" />
				</div>
			</div>
		</div>
	</div>
);

// debounce helper simpel
function useDebouncedCallback(cb, delay = 250) {
	const t = useRef();
	return (...args) => {
		clearTimeout(t.current);
		t.current = setTimeout(() => cb(...args), delay);
	};
}

const clamp = (v) => Math.max(1, Number.isFinite(+v) ? Math.floor(+v) : 1);

// ====== THEME CLASSES (input & textarea)
const inputTheme = 'bg-white/90 border border-violet-200 text-slate-900 placeholder:text-slate-400 ' + 'focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:border-violet-300 ' + 'shadow-sm rounded-md';

const textareaTheme = 'bg-white/90 border border-violet-200 text-slate-900 placeholder:text-slate-400 ' + 'focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:border-violet-300 ' + 'shadow-sm rounded-md min-h-[100px]';

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

	// ====== NEW: state qty draft + loading per item + loading clear
	const [qtyDraft, setQtyDraft] = useState({});
	const [loadingIds, setLoadingIds] = useState(new Set());
	const [loadingClear, setLoadingClear] = useState(false);

	const isLoading = (id) => loadingIds.has(id);

	const commitQty = async (id, next) => {
		const q = clamp(next);
		setQtyDraft((p) => ({ ...p, [id]: q }));
		setLoadingIds((s) => new Set(s).add(id));
		try {
			await Promise.resolve(updateQty(id, q));
		} finally {
			setLoadingIds((s) => {
				const n = new Set(s);
				n.delete(id);
				return n;
			});
		}
	};

	const dec = (it) => commitQty(it.id, (qtyDraft[it.id] ?? it.qty ?? 1) - 1);
	const inc = (it) => commitQty(it.id, (qtyDraft[it.id] ?? it.qty ?? 1) + 1);

	const debouncedCommit = useDebouncedCallback((id, val) => commitQty(id, val), 250);

	// ====== Auth check
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

	// ====== Persist checkout form
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

	// ====== Load saved addresses when modal opens
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

	// ====== Sync qtyDraft dengan items saat berubah
	useEffect(() => {
		const init = {};
		items.forEach((it) => (init[it.id] = it.qty ?? 1));
		setQtyDraft(init);
	}, [items]);

	// ====== Loading awal
	if (loading) {
		return <CartSkeleton />;
	}
	if (!user) return null;

	if (!items.length) {
		return (
			<div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-violet-200 bg-violet-50/20 p-10 text-center">
				<ShoppingCart className="mb-3 h-8 w-8 text-violet-600" />
				<p className="text-sm text-violet-700">Keranjang kamu masih kosong.</p>
				<Button asChild variant="pressPurple" className="mt-4">
					<Link href="/products">Mulai belanja</Link>
				</Button>
				<Toaster />
			</div>
		);
	}

	const handlePlaceOrder = async (e) => {
		e?.preventDefault?.();

		if (addressMode === 'saved') {
			if (!addressId) return toast.error('Pilih alamat tersimpan dulu.');
		} else if (!name.trim() || !phone.trim() || !address.trim()) {
			return toast.error('Nama, nomor HP, dan alamat wajib diisi.');
		}

		if (addressMode === 'manual') {
			if (!/^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(phone.replace(/\s|-/g, ''))) {
				return toast.error('Nomor HP tidak valid.');
			}
		}

		try {
			setPlacing(true);

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

	const handleClear = async () => {
		if (!items.length) return;
		setLoadingClear(true);
		try {
			await Promise.resolve(clear());
			toast.success('Keranjang dikosongkan.');
		} finally {
			setLoadingClear(false);
		}
	};

	return (
		<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
			{/* List item */}
			<div className="space-y-4 lg:col-span-2">
				{items.map((it) => {
					const draft = qtyDraft[it.id] ?? it.qty ?? 1;
					return (
						<div key={it.id} className="rounded-xl border border-violet-200 bg-white p-4 shadow-sm">
							<div className="flex items-start gap-4">
								<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-violet-50">
									{it.image ? <Image src={it.image} alt={it.nama} fill className="object-cover" /> : <div className="flex h-full w-full items-center justify-center text-xs text-violet-600">No Image</div>}
								</div>

								<div className="min-w-0 flex-1">
									<div className="flex items-start justify-between gap-3">
										<div className="truncate">
											<div className="truncate text-sm font-medium text-violet-900">{it.nama}</div>
											<div className="text-xs text-violet-600">{formatIDR(it.harga)}</div>
										</div>

										<button
											aria-label="Hapus item"
											className="text-violet-600 transition-colors hover:text-red-600 disabled:opacity-50"
											onClick={async () => {
												setLoadingIds((s) => new Set(s).add(it.id));
												try {
													await Promise.resolve(removeItem(it.id));
												} finally {
													setLoadingIds((s) => {
														const n = new Set(s);
														n.delete(it.id);
														return n;
													});
												}
											}}
											disabled={isLoading(it.id)}
										>
											{isLoading(it.id) ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
										</button>
									</div>

									{/* Qty controls */}
									<div className="mt-3 flex items-center gap-3">
										<span className="text-xs text-violet-600">Qty</span>

										<div className="flex items-center rounded-lg border border-violet-200">
											<Button type="button" variant="pressPurple" className="h-8 w-8 rounded-none hover:bg-violet-50" onClick={() => dec(it)} aria-label="Kurangi qty" disabled={isLoading(it.id) || clamp(draft) <= 1}>
												{isLoading(it.id) ? <Spinner className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
											</Button>

											<Input
												type="number"
												inputMode="numeric"
												min={1}
												value={draft}
												onChange={(e) => {
													const val = e.target.value;
													setQtyDraft((p) => ({ ...p, [it.id]: val }));
													debouncedCommit(it.id, val);
												}}
												onBlur={(e) => commitQty(it.id, e.target.value)}
												className={`
                          h-8 w-16 border-0 text-center
                          ${inputTheme}
                          focus-visible:ring-violet-500
                          [appearance:textfield]
                          [&::-webkit-outer-spin-button]:appearance-none
                          [&::-webkit-inner-spin-button]:appearance-none
                        `}
												aria-label={`Jumlah untuk ${it.nama}`}
											/>

											<Button type="button" variant="pressPurple" className="h-8 w-8 rounded-none hover:bg-violet-50" onClick={() => inc(it)} aria-label="Tambah qty" disabled={isLoading(it.id)}>
												{isLoading(it.id) ? <Spinner className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
											</Button>
										</div>

										<div className="ml-auto text-sm font-semibold text-violet-900">{formatIDR((it.harga || 0) * clamp(draft))}</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Ringkasan */}
			<div className="lg:col-span-1">
				<div className="sticky top-20 rounded-xl border border-violet-200 bg-white p-4 shadow-sm">
					<div className="space-y-2 text-sm">
						<div className="flex items-center justify-between text-base">
							<span className="font-medium text-violet-900">Total</span>
							<span className="font-extrabold text-violet-900">{formatIDR(totalPrice)}</span>
						</div>
					</div>

					<div className="mt-4 flex gap-2">
						<Button variant="pressPurple" className="flex-1 inline-flex items-center justify-center gap-2" onClick={() => setOpen(true)} disabled={placing}>
							{placing && <Spinner />}
							Lanjut Checkout
						</Button>

						<Button variant="pressPurple" onClick={handleClear} disabled={loadingClear} className="inline-flex items-center justify-center gap-2">
							{loadingClear && <Spinner />}
							Kosongkan
						</Button>
					</div>
				</div>
			</div>

			{/* Modal Checkout */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-lg bg-white border border-violet-200">
					<DialogHeader>
						<DialogTitle className="text-violet-800">Checkout</DialogTitle>
					</DialogHeader>

					<form onSubmit={handlePlaceOrder} className="space-y-4">
						<div className="grid grid-cols-1 gap-3">
							{/* Mode address */}
							<div className="grid gap-1.5">
								<Label>Alamat</Label>
								<div className="flex gap-2">
									<Button
										type="button"
										variant={addressMode === 'manual' ? 'pressPurple' : 'outline'}
										className={addressMode !== 'manual' ? 'border-violet-200 text-violet-700 hover:bg-violet-50' : ''}
										onClick={() => setAddressMode('manual')}
									>
										Manual
									</Button>
									<Button type="button" variant={addressMode === 'saved' ? 'pressPurple' : 'outline'} className={addressMode !== 'saved' ? 'border-violet-200 text-violet-700 hover:bg-violet-50' : ''} onClick={() => setAddressMode('saved')}>
										Pilih Tersimpan
									</Button>
								</div>
							</div>

							{addressMode === 'saved' ? (
								<div className="grid gap-1.5">
									<Label>Pilih Alamat Tersimpan</Label>
									<Select value={addressId} onValueChange={setAddressId}>
										<SelectTrigger className={`w-full ${inputTheme}`}>
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
										<div className="mt-3 rounded-lg border border-violet-200 bg-violet-50/30 p-3 text-sm">
											{(() => {
												const a = addresses.find((x) => x.id === addressId);
												if (!a) return null;
												return (
													<div className="space-y-1">
														<div className="font-medium text-violet-900">
															{a.recipient_name} • {a.phone}
														</div>
														<div className="whitespace-pre-wrap text-slate-800">{a.address}</div>
														{a.note ? <div className="text-slate-500">Catatan: {a.note}</div> : null}
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
										<Input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" required className={inputTheme} />
									</div>
									<div className="grid gap-1.5">
										<Label htmlFor="phone">No. HP</Label>
										<Input id="phone" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxx" required className={inputTheme} />
									</div>
									<div className="grid gap-1.5">
										<Label htmlFor="address">Alamat</Label>
										<Textarea id="address" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Jalan, Kelurahan, Kecamatan, Kota, Kode Pos" required className={textareaTheme} />
									</div>
									<div className="grid gap-1.5">
										<Label htmlFor="note">Catatan (opsional)</Label>
										<Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Mis: Titip di satpam" className={textareaTheme} />
									</div>
									<div>
										<Button
											type="button"
											variant="pressPurple"
											className="border-violet-200 text-violet-700 hover:bg-violet-50"
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
											className={['rounded-md border px-3 py-2 text-sm transition-colors', payment === opt ? 'border-violet-500 bg-violet-100 text-violet-700' : 'border-violet-200 hover:bg-violet-50 text-violet-600'].join(' ')}
											aria-pressed={payment === opt}
											aria-label={`Pilih ${opt.toUpperCase()}`}
										>
											{opt.toUpperCase()}
										</button>
									))}
								</div>
							</div>

							<div className="rounded-md border border-violet-200 bg-violet-50/20 p-3 text-sm">
								<div className="flex items-center justify-between">
									<span className="text-violet-900">Total Dibayar</span>
									<span className="font-bold text-violet-900">{formatIDR(totalPrice)}</span>
								</div>
							</div>
						</div>

						<DialogFooter className="gap-2 sm:gap-4">
							<Button type="button" variant="pressPurple" onClick={() => setOpen(false)}>
								Batal
							</Button>
							<Button variant="pressPurple" type="submit" disabled={placing} className="inline-flex items-center gap-2">
								{placing && <Spinner />}
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
