import { Badge } from '@/components/ui/badge';

export default function ProductHero({ product, productTags }) {
	return (
		<div className="mb-6">
			<div className="flex items-center gap-2">
				{product.kategori && (
					<Badge variant="secondary" className="capitalize bg-violet-100 text-violet-800 border-0">
						{product.kategori}
					</Badge>
				)}
				{productTags.includes('baru') && (
					<Badge variant="outline" className="border-violet-200 text-violet-700">
						Baru
					</Badge>
				)}
			</div>
			<h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-violet-900">{product.nama}</h1>
		</div>
	);
}
