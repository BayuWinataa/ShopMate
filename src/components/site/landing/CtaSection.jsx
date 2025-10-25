import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
	return (
		<section aria-labelledby="cta-title" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
			<div className="mx-auto max-w-4xl rounded-3xl border border-slate-200/80 bg-white/70 p-8 text-center shadow-sm backdrop-blur supports-[backdrop-filter]:backdrop-blur">
				<h3 id="cta-title" className="text-2xl md:text-3xl font-bold tracking-tight">
					Siap belanja dengan <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ShopMate AI</span>?
				</h3>
				<p className="mx-auto mt-2 max-w-xl text-slate-600">Coba sekarang dan rasakan belanja yang cepat, akurat, dan menyenangkan. AI yang paham kebutuhanmu.</p>
				<div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
					<Button asChild size="lg" className="font-semibold">
						<Link href="/products">
							Lihat Katalog <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
