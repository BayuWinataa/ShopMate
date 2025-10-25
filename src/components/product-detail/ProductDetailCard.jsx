import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function ProductDetailCard({ longDeskripsi }) {
	if (!longDeskripsi) return null;

	return (
		<Card className="border-0 ring-1 ring-violet-100">
			<CardContent className="p-5">
				<h3 className="text-xl font-semibold text-violet-800">Detail Produk</h3>
				<Separator className="my-4" />
				<div className="prose prose-slate max-w-none">
					<p className="leading-relaxed whitespace-pre-line">{longDeskripsi}</p>
				</div>
			</CardContent>
		</Card>
	);
}
