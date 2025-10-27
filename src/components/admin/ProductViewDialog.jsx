'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

function formatIDR(n) {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0,
	}).format(Number.isFinite(Number(n)) ? Number(n) : 0);
}

export default function ProductViewDialog({ product, triggerLabel = 'Lihat' }) {
	const [imgLoaded, setImgLoaded] = useState(false);

	const img = product?.gambar || product?.image || '/Frame 1.svg';
	const created = product?.created_at ? new Date(product.created_at).toLocaleDateString('id-ID') : null;
	const updated = product?.updated_at ? new Date(product.updated_at).toLocaleDateString('id-ID') : null;

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
				<Button size="sm" variant="pressViolet">
					{triggerLabel}
				</Button>
			</DialogTrigger>

			<DialogContent showCloseButton={false} className="w-[calc(100%-1rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
				{/* Header */}
				<DialogHeader className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3">
					<div className="min-w-0">
						<DialogTitle className="truncate text-lg sm:text-xl leading-tight text-violet-900 pr-8 break-words">{product?.nama ?? 'Detail Produk'}</DialogTitle>
						{(product?.kategori || created || updated) && (
							<DialogDescription className="mt-1 text-sm text-violet-600">
								{product?.kategori ? <span className="capitalize">{product.kategori}</span> : null}
								{created ? (
									<>
										<span className="block sm:inline">
											{' '}
											{product?.kategori ? '• ' : ''}Dibuat: {created}
										</span>
									</>
								) : null}
								{updated ? <span className="block sm:inline"> • Diperbarui: {updated}</span> : null}
							</DialogDescription>
						)}
					</div>
				</DialogHeader>

				{/* Separator */}
				<div className="h-px bg-border/80" />

				{/* Body scrollable */}
				<div className="px-4 sm:px-5 py-4">
					<div className="grid grid-cols-1 gap-4">
						{/* Image */}
						<div>
							<div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
								{!imgLoaded && <Skeleton className="absolute inset-0" />}
								<Image
									src={img}
									alt={product?.nama || 'Product image'}
									fill
									onLoad={() => setImgLoaded(true)}
									className={`object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									priority
								/>
							</div>
						</div>

						{/* Info */}
						<div className="space-y-4">
							{/* Price & Key Info */}
							{product?.harga && (
								<div className="bg-violet-50 rounded-lg p-3 sm:p-4">
									<div className="text-2xl sm:text-3xl font-bold text-violet-900 mb-2 break-all">{formatIDR(product.harga)}</div>
									{product?.stok !== undefined && (
										<div className="text-sm text-violet-600">
											Stok: <span className={`font-medium ${product.stok > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.stok > 0 ? `${product.stok} tersedia` : 'Habis'}</span>
										</div>
									)}
								</div>
							)}

							{/* Semua Data dari Database */}
							<div className="rounded-lg border bg-white">
								<div className="px-3 sm:px-4 py-3 border-b text-sm font-medium text-violet-900">Semua Data</div>
								<div className="px-3 sm:px-4 py-3">
									<div className="grid grid-cols-1 gap-3">
										{Object.entries(product || {}).map(([key, val]) => (
											<div key={key} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
												<div className="grid gap-1 grid-cols-1 sm:grid-cols-[minmax(100px,120px)_1fr] md:grid-cols-[minmax(120px,140px)_1fr] items-start text-sm">
													<div className="text-violet-600 font-medium break-words text-xs sm:text-sm min-w-0">{formatKey(key)}</div>
													<div className="text-violet-900 break-words whitespace-pre-wrap overflow-wrap-anywhere text-sm min-w-0">
														{key === 'gambar' || key === 'image' ? (
															<a href={formatValue(key, val)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline break-all hover:no-underline transition-colors text-sm">
																{formatValue(key, val)}
															</a>
														) : (
															formatValue(key, val)
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Separator */}
				<div className="h-px bg-border/80" />

				{/* Footer */}
				<div className="flex flex-col-reverse sm:flex-row justify-end gap-2 px-4 sm:px-5 py-4 border-t bg-gray-50">
					<DialogClose asChild>
						<Button variant="outline" className="w-full sm:w-auto order-2 sm:order-1">
							Tutup
						</Button>
					</DialogClose>
					{/* placeholder for future actions (Edit/Delete) - keeps layout consistent */}
					<div className="w-full sm:w-auto order-1 sm:order-2" />
				</div>
			</DialogContent>
		</Dialog>
	);
}
