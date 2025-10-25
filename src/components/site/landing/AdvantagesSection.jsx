import { Badge } from '@/components/ui/badge';
import Adv from '@/components/site/landing/Adv';
import { Bot, Gauge, Wand2, MessageSquare, Shield, Rocket } from 'lucide-react';

export default function AdvantagesSection() {
	return (
		<section aria-labelledby="adv-title" className="relative overflow-hidden">
			{/* subtle backdrop grid */}
			<div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(139,92,246,0.08),transparent_40%),radial-gradient(circle_at_100%_20%,rgba(99,102,241,0.06),transparent_40%)]" />
			</div>

			<div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="mx-auto max-w-4xl text-center">
					<Badge variant="secondary" className="mb-2">
						KEUNGGULAN AI
					</Badge>

					<h2 id="adv-title" className="text-3xl md:text-4xl font-bold tracking-tight">
						Kenapa AI kami berbeda?
					</h2>

					<p className="mt-2 text-slate-600 dark:text-slate-300">Bukan sekadar chatbot AI—kami paham konteks belanja & kebiasaanmu.</p>
				</div>

				<div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
					<Adv icon={<Bot className="h-5 w-5" aria-hidden />} title="Personalized by context" desc="Jawaban menyesuaikan preferensi, budget, & kategori yang sering kamu lihat." />
					<Adv icon={<Gauge className="h-5 w-5" aria-hidden />} title="Cepat & relevan" desc="Rekomendasi ringkas, fokus ke value nyata: performa, garansi, harga terbaik." />
					<Adv icon={<Wand2 className="h-5 w-5" aria-hidden />} title="Instan compare" desc="Bandingkan dua produk dalam dialog debat AI yang jelas plus-minusnya." />
					<Adv icon={<MessageSquare className="h-5 w-5" aria-hidden />} title="Explainable" desc="AI menyebutkan alasan di balik saran—transparan & mudah dipercaya." />
					<Adv icon={<Shield className="h-5 w-5" aria-hidden />} title="AI yang Aman" desc="Data belanja & invoice diproses dengan kontrol privasi berlapis." />
					<Adv icon={<Rocket className="h-5 w-5" aria-hidden />} title="Menyatu dengan alur belanja" desc="Terhubung ke katalog, keranjang, checkout, & riwayat belanja." />
				</div>
			</div>
		</section>
	);
}
