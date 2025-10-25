import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { createSlug } from '@/lib/slugify';

const formatIDR = (n) =>
	new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0,
	}).format(Number.isFinite(n) ? n : 0);

export default function RelatedProducts({ related, fallbackImg }) {
	if (!related || related.length === 0) return null;

	return (
		<>
			<Separator className="my-10" />
			<section>
				<h2 className="text-lg md:text-xl font-semibold text-violet-800">Produk Terkait</h2>
				<p className="text-sm text-muted-foreground">Barang serupa yang mungkin kamu suka.</p>
				<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{related.map((p) => {
						const rImg = p.gambar || p.image || fallbackImg;
						const relatedSlug = createSlug(p.nama);
						return (
							<Link key={p.id} href={`/products/${relatedSlug}`} className="group relative">
								<div className="block">
									<div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm hover:shadow-xl transition-all duration-500">
										{/* Gradient overlay on hover */}
										<div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-purple-500/0 to-fuchsia-500/0 group-hover:from-violet-500/10 group-hover:via-purple-500/10 group-hover:to-fuchsia-500/10 transition-all duration-500 z-10 pointer-events-none" />
										{/* Shine effect */}
										<div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none" />
										{/* Image area */}
										<div className="relative aspect-square overflow-hidden bg-gradient-to-br from-violet-50 to-purple-50 ">
											<Image src={rImg} alt={p.nama} fill className="object-cover group-hover:scale-110 group-hover:rotate-2 transition-all duration-700 " />
										</div>
										{/* Content */}
										<div className="p-5 space-y-3">
											{p.kategori && (
												<div>
													<Badge variant="secondary" className="bg-violet-100 text-violet-700 hover:bg-violet-200 font-medium capitalize">
														{p.kategori}
													</Badge>
												</div>
											)}
											<h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-violet-700 transition-colors duration-300">{p.nama}</h3>
											<div className="flex flex-col gap-1">
												<p className="text-2xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{formatIDR(p.harga)}</p>
											</div>
										</div>
										{/* Bottom accent */}
										<div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			</section>
		</>
	);
}
