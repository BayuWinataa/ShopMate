'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare } from 'lucide-react';
import bg1 from '../../../../public/bg-1.svg';
import bg2 from '../../../../public/bg-2.svg';
import bg3 from '../../../../public/bg-3.svg';

export default function HeroSection() {
	return (
		<section aria-labelledby="hero-title" className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-neutral-950 dark:to-neutral-900">
			{/* Background SVGs */}
			<Image src={bg1} alt="" priority aria-hidden="true" className="pointer-events-none select-none absolute top-0 -left-20 w-48 md:w-72 opacity-80" />
			<Image src={bg2} alt="" priority aria-hidden="true" className="pointer-events-none select-none absolute top-0 -right-10 w-60 md:w-80 opacity-80" />
			<Image src={bg3} alt="" priority aria-hidden="true" className="pointer-events-none select-none absolute bottom-0 -right-10 w-60 md:w-80 opacity-90" />

			{/* Content */}
			<div className="relative z-10 container mx-auto px-6 lg:px-10 py-24 flex flex-col items-center text-center">
				<h1 id="hero-title" className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-50">
					Belanja <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">lebih cerdas</span> bersama AI
				</h1>

				<p className="mt-5 max-w-2xl text-base md:text-lg text-gray-600 dark:text-gray-300">
					Jelajahi katalog, minta rekomendasi personal, dan bandingkan produk secara instan. Kini hadir <strong className="font-semibold text-gray-900 dark:text-gray-100">Invoice IQ</strong>— tanya apa pun tentang invoice, AI menjawab
					seketika.
				</p>

				<div className="mt-8 flex flex-col sm:flex-row gap-4">
					<Button asChild size="lg" className="font-semibold shadow-[0_4px_0_#6b21a8] active:shadow-none active:translate-y-[4px] bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:opacity-90">
						<Link href="/products">
							Jelajahi Produk
							<ArrowRight className="ml-2 h-5 w-5" />
						</Link>
					</Button>

					<Button asChild size="lg" variant="outline" className="font-semibold border-violet-500 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all">
						<Link href="/chat">
							<MessageSquare className="mr-2 h-5 w-5" />
							Chat dengan AI
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
