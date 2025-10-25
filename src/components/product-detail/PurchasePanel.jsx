'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import AddToCartButton from '@/components/cart/AddToCartButton';

const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);

export default function PurchasePanel({ product, cartProduct }) {
	return (
		<div className="lg:sticky lg:top-20 space-y-4">
			{/* Price & Actions Card */}
			<Card className="border-0 ring-1 ring-violet-100">
				<CardContent className="px-4 py-2 w-full">
					<div className="flex items-start justify-between gap-3">
						<div>
							<div className="text-xs uppercase tracking-wide text-violet-500">Harga</div>
							<div className="text-3xl font-extrabold text-violet-600">{formatIDR(product.harga)}</div>
						</div>
					</div>

					<div className="mt-5 grid gap-3 w-full">
						{/* pastikan tombol keranjang juga nggak overflow */}
						<AddToCartButton product={cartProduct} className="w-full min-w-0" />

						{/* === TOMBOL YANG DIBAHAS === */}
						<Button
							asChild
							variant="pressPurple"
							className="
                w-full max-w-full min-w-0
                inline-flex items-center justify-center gap-2
                border-violet-200 text-violet-700
                whitespace-normal break-words
                px-3 py-3
                text-sm sm:text-base
              "
						>
							<Link href={`/chat?ask=${encodeURIComponent(`Tolong jelaskan tentang produk ${product.nama}`)}`} className="flex w-full min-w-0 items-center justify-center gap-2 text-center">
								<MessageSquare className="h-4 w-4 flex-shrink-0" aria-hidden />
								{/* Label adaptif: pendek di mobile, panjang di ≥sm */}
								<span className="block min-w-0 text-balance">
									<span className="sm:hidden text-base">Tanya AI</span>
									<span className="hidden sm:inline text-base">Tanya AI tentang produk ini</span>
								</span>
							</Link>
						</Button>
					</div>

					{product.deskripsi && <div className="mt-6 text-sm text-slate-700 leading-relaxed">{product.deskripsi}</div>}
				</CardContent>
			</Card>

			{/* Brand & Notes Card */}
			{(product.catatan || product.brand) && (
				<Card className="border-0 ring-1 ring-violet-100">
					<CardContent className="p-5 text-sm text-slate-600">
						{product.brand && (
							<p>
								<span className="font-medium text-violet-900">Brand:</span> {product.brand}
							</p>
						)}
						{product.catatan && (
							<p className="mt-2">
								<span className="font-medium text-violet-900">Catatan:</span> {product.catatan}
							</p>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
