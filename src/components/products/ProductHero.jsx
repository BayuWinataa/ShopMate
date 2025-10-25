import Link from 'next/link';
import { Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductHero() {
	return (
		<section className="relative">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
				<div className="relative overflow-hidden rounded-3xl border border-violet-200 bg-[radial-gradient(80%_120%_at_0%_0%,rgba(139,92,246,0.15),rgba(147,51,234,0.18)_40%,rgba(168,85,247,0.15)_80%)] shadow-lg shadow-violet-200/50">
					<div className="absolute inset-0 -z-10 blur-2xl opacity-80" />
					<div className="p-8 md:p-12 text-slate-900">
						<div className="mx-auto max-w-3xl text-center">
							<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 ring-1 ring-violet-500/20">
								<Sparkles className="h-5 w-5 text-violet-600" />
							</div>
							<h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
								Belanja <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">lebih smart</span> dengan AI
							</h1>
							<p className="mt-4 text-slate-700 text-lg">Filter cepat, rekomendasi pintar, dan detail produk yang rapi. Kamu fokus pilih yang cocok, AI bantu sisanya.</p>
							<div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
								<Button asChild variant="pressPurple" size="lg" className="font-semibold">
									<Link href="/chat" className="inline-flex items-center gap-2">
										<MessageSquare className="h-5 w-5" /> Tanya AI Sekarang
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
