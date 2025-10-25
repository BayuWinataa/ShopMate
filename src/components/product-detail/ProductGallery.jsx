import Image from 'next/image';
import { Card } from '@/components/ui/card';

export default function ProductGallery({ imgSrc, productName }) {
	return (
		<Card className="overflow-hidden border-0 ring-1 ring-violet-100">
			<div className="relative aspect-[4/3] w-full">
				<Image src={imgSrc} alt={productName} fill className="object-cover object-center" priority />
			</div>
		</Card>
	);
}
