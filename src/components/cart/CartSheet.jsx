// src/components/cart/CartSheet.jsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from './CartProvider';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);

// spinner kecil (tanpa lib tambahan)
const Spinner = ({ className = 'h-4 w-4' }) => (
	<svg className={`animate-spin ${className}`} viewBox="0 0 24 24" aria-hidden>
		<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
		<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
	</svg>
);

export default function CartSheet() {
	const { items, removeItem, updateQty, totalPrice, open, setOpen, clear } = useCart();
	const router = useRouter();

	// --- State untuk qty lokal (biar input bisa diketik bebas), loading per item, loading aksi besar
	const [qtyDraft, setQtyDraft] = useState({});
	const [loadingIds, setLoadingIds] = useState(new Set());
	const [loadingCheckout, setLoadingCheckout] = useState(false);
	const [loadingClear, setLoadingClear] = useState(false);

	// sync qtyDraft dengan items terbaru
	useEffect(() => {
		const init = {};
		items.forEach((it) => {
			init[it.id] = it.qty ?? 1;
		});
		setQtyDraft(init);
	}, [items]);

	const clamp = (v) => Math.max(1, Number.isFinite(+v) ? Math.floor(+v) : 1);

	const setItemDraft = (id, val) => {
		setQtyDraft((prev) => ({ ...prev, [id]: val }));
	};

	const commitQty = async (id, nextQty) => {
		const q = clamp(nextQty);
		// optimistik: set draft dulu, lalu call updateQty
		setQtyDraft((prev) => ({ ...prev, [id]: q }));
		setLoadingIds((s) => new Set(s).add(id));
		try {
			// jika updateQty asynchronous, tunggu. kalau sync, Promise.resolve bikin aman.
			await Promise.resolve(updateQty(id, q));
		} finally {
			setLoadingIds((s) => {
				const n = new Set(s);
				n.delete(id);
				return n;
			});
		}
	};

	const inc = (id) => commitQty(id, (qtyDraft[id] ?? 1) + 1);
	const dec = (id) => commitQty(id, (qtyDraft[id] ?? 1) - 1);

	const handleCheckout = async (e) => {
		e.preventDefault();
		if (!items.length) return;
		setLoadingCheckout(true);
		try {
			setOpen(false);
			// jeda kecil biar animasi sheet nutup terasa
			await new Promise((r) => setTimeout(r, 150));
			router.push('/cart');
		} finally {
			setLoadingCheckout(false);
		}
	};

	const handleClear = async () => {
		if (!items.length) return;
		setLoadingClear(true);
		try {
			await Promise.resolve(clear());
		} finally {
			setLoadingClear(false);
		}
	};

	const isLoading = (id) => loadingIds.has(id);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent side="right" className="w-[360px] sm:w-[420px]">
				<SheetHeader>
					<SheetTitle className="text-violet-800 font-semibold">Keranjang</SheetTitle>
				</SheetHeader>

				<div className="mt-4 space-y-4 mx-4">
					{items.length === 0 ? (
						<p className="text-sm text-muted-foreground">Keranjang masih kosong.</p>
					) : (
						items.map((it) => {
							const draft = qtyDraft[it.id] ?? it.qty ?? 1;
							return (
								<div key={it.id} className="flex gap-3">
									<div className="relative h-16 w-16 overflow-hidden rounded border bg-muted">{it.image ? <Image src={it.image} alt={it.nama} fill className="object-cover" /> : <div className="h-full w-full" />}</div>

									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between gap-2">
											<div className="min-w-0">
												<div className="text-sm font-medium leading-tight line-clamp-2">{it.nama}</div>
												<div className="text-xs text-muted-foreground mt-0.5">{formatIDR(it.harga)}</div>
											</div>

											<button className="text-xs text-violet-600 hover:text-violet-800 hover:underline disabled:opacity-50" onClick={() => removeItem(it.id)} disabled={isLoading(it.id)}>
												Hapus
											</button>
										</div>

										<div className="mt-2 flex items-center gap-2">
											<span className="text-xs">Qty</span>

											<Button
												type="button"
												variant="pressPurple"
												size="sm"
												className="h-8 w-8 p-0 border-violet-200 text-violet-700 hover:bg-violet-50"
												onClick={() => dec(it.id)}
												disabled={isLoading(it.id) || draft <= 1}
												aria-label="Kurangi jumlah"
											>
												{isLoading(it.id) ? <Spinner className="h-3.5 w-3.5" /> : '-'}
											</Button>

											<Input
												type="number"
												min={1}
												inputMode="numeric"
												value={draft}
												onChange={(e) => setItemDraft(it.id, e.target.value)}
												onBlur={(e) => commitQty(it.id, e.target.value)}
												aria-label="Jumlah"
												className="
      h-8 w-16 text-center
      bg-white border-violet-200 text-slate-800 font-medium
      [appearance:textfield]
      [&::-webkit-outer-spin-button]:appearance-none
      [&::-webkit-inner-spin-button]:appearance-none
    "
											/>

											<Button type="button" variant="pressPurple" size="sm" className="h-8 w-8 p-0 border-violet-200 text-violet-700 hover:bg-violet-50" onClick={() => inc(it.id)} disabled={isLoading(it.id)} aria-label="Tambah jumlah">
												{isLoading(it.id) ? <Spinner className="h-3.5 w-3.5" /> : '+'}
											</Button>

											<div className="ml-auto text-sm font-semibold">{formatIDR((it.harga || 0) * clamp(draft))}</div>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>

				<Separator className="my-4 bg-violet-100" />

				<div className="flex items-center justify-between text-sm mx-4 text-violet-800">
					<span className="text-violet-600">Subtotal</span>
					<span className="font-semibold text-violet-900">{formatIDR(totalPrice)}</span>
				</div>

				<SheetFooter className="mt-4 gap-2">
					<Button variant="pressPurple" onClick={handleClear} disabled={!items.length || loadingClear || loadingCheckout} className="inline-flex items-center gap-2">
						{loadingClear && <Spinner />}
						Kosongkan Keranjang
					</Button>

					<Button variant="pressPurple" onClick={handleCheckout} disabled={!items.length || loadingCheckout || loadingClear} className="inline-flex items-center gap-2">
						{loadingCheckout && <Spinner />}
						Checkout
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
