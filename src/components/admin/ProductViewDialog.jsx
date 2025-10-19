'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

function formatIDR(n) {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0,
	}).format(Number.isFinite(Number(n)) ? Number(n) : 0);
}

export default function ProductViewDialog({ product, triggerLabel = 'Lihat' }) {
	const [showMore, setShowMore] = useState(false);
	const [imgLoaded, setImgLoaded] = useState(false);

	const img = product?.gambar || product?.image || '/Frame 1.svg';
	const created = product?.created_at ? new Date(product.created_at).toLocaleDateString('id-ID') : '-';
	const updated = product?.updated_at ? new Date(product.updated_at).toLocaleDateString('id-ID') : null;

	const tags = useMemo(() => {
		try {
			if (Array.isArray(product?.tags)) return product.tags;
			if (typeof product?.tags === 'string') return JSON.parse(product.tags || '[]');
			return [];
		} catch {
			return [];
		}
	}, [product]);

	const stockBadge = (v) => {
		if (v == null) return null;
		const n = Number(v);
		const style = n <= 0 ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' : n < 10 ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
		const label = n <= 0 ? 'Stok Habis' : n < 10 ? `Stok Tipis (${n})` : `Stok ${n}`;
		return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${style}`}>{label}</span>;
	};

	const copyId = async () => {
		try {
			if (!product?.id) return;
			await navigator.clipboard.writeText(String(product.id));
			// optional: toast kalau kamu punya komponen toast
		} catch {}
	};

	const formatKey = (k) => {
		try {
			const spaced = k
				.replace(/([a-z])([A-Z])/g, '$1 $2')
				.replace(/[_-]+/g, ' ')
				.toLowerCase();
			return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
		} catch {
			return k;
		}
	};

	const formatValue = (key, val) => {
		if (val === null || val === undefined) return '-';
		if (key === 'harga') return formatIDR(val);
		if (key === 'created_at' || key === 'updated_at') {
			try {
				return new Date(val).toLocaleString('id-ID');
			} catch {
				return String(val);
			}
		}
		if (key === 'tags') {
			try {
				const arr = Array.isArray(val) ? val : typeof val === 'string' ? JSON.parse(val || '[]') : [];
				return arr.length ? arr.join(', ') : '-';
			} catch {
				return String(val);
			}
		}
		if (typeof val === 'object') {
			try {
				return JSON.stringify(val);
			} catch {
				return String(val);
			}
		}
		return String(val);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="sm" variant="outline">
					{triggerLabel}
				</Button>
			</DialogTrigger>

			<DialogContent showCloseButton={false} className="w-[calc(100%-1rem)] sm:max-w-2xl md:max-w-3xl max-h-[88vh] overflow-hidden p-0">
				{/* Header */}
				<DialogHeader className="px-5 pt-5 pb-3">
					<div className="flex items-start justify-between gap-3">
						<div className="min-w-0">
							<DialogTitle className="truncate text-xl leading-tight">{product?.nama ?? 'Detail Produk'}</DialogTitle>
							<DialogDescription className="mt-1">
								<span className="capitalize">{product?.kategori || '-'}</span> • Dibuat: {created}
								{updated ? <> • Diperbarui: {updated}</> : null}
							</DialogDescription>
						</div>
						{/* Price badge */}
						<div className="shrink-0 flex flex-col items-end gap-2">
							<span className="inline-flex items-center rounded-lg bg-indigo-600 text-white px-3 py-1.5 text-sm font-semibold shadow-sm">{formatIDR(product?.harga)}</span>
							{stockBadge(product?.stok)}
						</div>
					</div>
				</DialogHeader>

				{/* Separator */}
				<div className="h-px bg-border/80" />

				{/* Body scrollable */}
				<ScrollArea className="px-5 py-4 max-h-[60vh]">
					<div className="grid grid-cols-1">
						{/* Image */}
						<div className="">
							<div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
								{!imgLoaded && <Skeleton className="absolute inset-0" />}
								<Image
									src={img}
									alt={product?.nama || 'Product image'}
									fill
									onLoad={() => setImgLoaded(true)}
									className={`object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
									sizes="(max-width: 768px) 100vw, 40vw"
									priority
								/>
							</div>

							{/* Tags */}
							{tags.length > 0 && (
								<div className="mt-3 flex flex-wrap gap-2">
									{tags.slice(0, 8).map((t) => (
										<span key={t} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 ring-1 ring-gray-200">
											#{t}
										</span>
									))}
									{tags.length > 8 && <span className="text-xs text-gray-500">+{tags.length - 8} lainnya</span>}
								</div>
							)}
						</div>

						{/* Info */}
						<div className="md:col-span-7 space-y-4">
							{/* Semua Data */}
							<div className="rounded-lg border bg-white">
								<div className="px-4 py-3 border-b text-sm font-medium">Deskripsi</div>
								<div className="px-4 py-3">
									<div className="grid grid-cols-1 gap-2">
										{Object.entries(product || {}).map(([key, val]) => (
											<div key={key} className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-1 items-start text-sm">
												<div className="text-muted-foreground  ">{formatKey(key)}</div>
												<div className="text-foreground break-words whitespace-pre-wrap">{formatValue(key, val)}</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</ScrollArea>

				{/* Separator */}
				<div className="h-px bg-border/80" />

				{/* Footer */}
				<DialogFooter className="px-5 py-4">
					<DialogClose asChild>
						<Button type="button" variant="default">
							Tutup
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
