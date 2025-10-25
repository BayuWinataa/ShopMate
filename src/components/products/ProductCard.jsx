import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { createSlug } from '@/lib/slugify';

export default function ProductCard({ product, idx }) {
	const slug = createSlug(product.nama);

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: idx * 0.05 }} className="group relative">
			<Link href={`/products/${slug}`} className="block">
				<div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm hover:shadow-xl transition-all duration-500">
					{/* Gradient overlay on hover */}
					<div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-purple-500/0 to-fuchsia-500/0 group-hover:from-violet-500/10 group-hover:via-purple-500/10 group-hover:to-fuchsia-500/10 transition-all duration-500 z-10 pointer-events-none" />

					{/* Shine effect */}
					<div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none" />

					{/* Image */}
					<div className="relative aspect-square overflow-hidden bg-gradient-to-br from-violet-50 to-purple-50">
						<Image src={product.gambar || product.image_url || '/placeholder.jpg'} alt={product.nama} fill className="object-cover group-hover:scale-110 group-hover:rotate-2 transition-all duration-700" />
					</div>

					{/* Content */}
					<div className="p-5 space-y-3">
						{/* Category */}
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Badge variant="secondary" className="bg-violet-100 text-violet-700 hover:bg-violet-200 font-medium capitalize">
								{product.kategori}
							</Badge>
						</motion.div>

						{/* Name */}
						<h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-violet-700 transition-colors duration-300">{product.nama}</h3>

						{/* Price */}
						<div className="flex flex-col gap-1">
							<p className="text-2xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Rp {(product.harga || 0).toLocaleString('id-ID')}</p>
						</div>
					</div>

					{/* Bottom accent */}
					<div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
				</div>
			</Link>
		</motion.div>
	);
}
