'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Scale } from 'lucide-react';
import { createSlug } from '@/lib/slugify';

function ProductSkeleton() {
	return (
		<div className="group flex flex-col w-full rounded-lg border border-violet-200 p-2 bg-white mb-2">
			<div className="flex items-center gap-3 mb-3">
				<div className="h-14 w-14 md:h-16 md:w-16 rounded-lg bg-violet-100 flex-shrink-0 animate-pulse"></div>
				<div className="min-w-0 flex-1 space-y-2">
					<div className="h-4 bg-violet-100 rounded w-3/4 animate-pulse"></div>
					<div className="h-4 bg-violet-100 rounded w-1/2 animate-pulse"></div>
				</div>
			</div>

			<div className="flex gap-2 border-t border-violet-100 pt-2 flex-wrap">
				<div className="flex-1 h-9 bg-violet-100 rounded-lg animate-pulse"></div>
				<div className="flex-1 h-9 bg-violet-100 rounded-lg animate-pulse"></div>
			</div>
		</div>
	);
}

function ProductSkeletonList({ count = 4 }) {
	return (
		<div className="space-y-2">
			{Array.from({ length: count }, (_, i) => (
				<ProductSkeleton key={i} />
			))}
		</div>
	);
}

export { ProductSkeletonList };
export default function RecList({ items, formatIDR, isSelectedForCompare, toggleCompare }) {
	const containerVariants = {
		hidden: {},
		show: {
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
	};

	if (!items || items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-violet-200 bg-violet-50 px-3 py-6 text-center text-violet-700">
				<p className="font-medium text-sm">Belum ada rekomendasi</p>
				<p className="mt-1 max-w-sm text-xs text-violet-600">Saat AI memberi saran, produk muncul di sini.</p>
			</div>
		);
	}

	return (
		<motion.div variants={containerVariants} initial="hidden" animate="show">
			{items.map((product, idx) => (
				<motion.div key={`${product.id}-${idx}`} variants={itemVariants} className="group flex flex-col w-full rounded-lg border border-violet-200 p-2 transition-all hover:border-violet-300 hover:shadow-sm bg-white mb-2">
					<div className="flex items-center gap-3 mb-3">
						<Image src={product.gambar || product.image || '/placeholder.jpg'} alt={product.nama} width={64} height={64} className="h-14 w-14 md:h-16 md:w-16 rounded-lg object-cover flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<p className="font-medium text-sm sm:text-base leading-tight mb-1 text-violet-900 wrap line-clamp-3">{product.nama}</p>
							<p className="font-semibold text-violet-600 text-sm sm:text-base">{formatIDR(product.harga)}</p>
						</div>
					</div>

					<div className="flex gap-2 border-t border-violet-100 pt-2 flex-wrap">
						<motion.button
							onClick={() => toggleCompare(product)}
							whileTap={{ scale: 0.95 }}
							transition={{ type: 'spring', stiffness: 400, damping: 17 }}
							className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
								isSelectedForCompare(product) ? 'border-violet-300 bg-violet-50 text-violet-700' : 'border-violet-200 bg-violet-50/50 text-violet-700 hover:bg-violet-100'
							}`}
							aria-label={isSelectedForCompare(product) ? 'Hapus dari perbandingan' : 'Tambah ke perbandingan'}
						>
							<Scale className="h-4 w-4" />
							<span>{isSelectedForCompare(product) ? 'Dipilih' : 'Bandingkan'}</span>
						</motion.button>

						<motion.div whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
							<Link
								href={`/products/${createSlug(product.nama || product.name || product.title)}`}
								className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50 transition-colors"
								aria-label={`Detail ${product.nama}`}
							>
								<span>Detail</span>
								<ArrowRight className="h-4 w-4" />
							</Link>
						</motion.div>
					</div>
				</motion.div>
			))}
		</motion.div>
	);
}
