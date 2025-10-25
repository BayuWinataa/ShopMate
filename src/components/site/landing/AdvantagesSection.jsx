'use client';

import { Badge } from '@/components/ui/badge';
import Adv from '@/components/site/landing/Adv';
import { Bot, Gauge, Wand2, MessageSquare, Shield, Rocket } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useLayoutEffect, useState } from 'react';

export default function AdvantagesSection() {
	const containerRef = useRef(null);
	const trackRef = useRef(null);

	const [distance, setDistance] = useState(0);
	const [sectionHeight, setSectionHeight] = useState(undefined);

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start start', 'end end'],
	});

	const x = useTransform(scrollYProgress, [0, 1], [0, distance * -1]);

	useLayoutEffect(() => {
		const measure = () => {
			const container = containerRef.current;
			const track = trackRef.current;
			if (!container || !track) return;

			const vw = container.clientWidth;
			const totalScrollable = Math.max(0, track.scrollWidth - vw);

			setDistance(totalScrollable);

			const vh = window.innerHeight;
			setSectionHeight(vh + totalScrollable);
		};

		measure();

		const ro = new ResizeObserver(measure);
		if (trackRef.current) ro.observe(trackRef.current);
		if (containerRef.current) ro.observe(containerRef.current);

		window.addEventListener('resize', measure);
		return () => {
			ro.disconnect();
			window.removeEventListener('resize', measure);
		};
	}, []);

	const advantages = [
		{ icon: <Bot className="h-5 w-5" aria-hidden />, title: 'Personalized by context', desc: 'Jawaban menyesuaikan preferensi, budget, & kategori yang sering kamu lihat.' },
		{ icon: <Gauge className="h-5 w-5" aria-hidden />, title: 'Cepat & relevan', desc: 'Rekomendasi ringkas, fokus ke value nyata: performa, garansi, harga terbaik.' },
		{ icon: <Wand2 className="h-5 w-5" aria-hidden />, title: 'Instan compare', desc: 'Bandingkan dua produk dalam dialog debat AI yang jelas plus-minusnya.' },
		{ icon: <MessageSquare className="h-5 w-5" aria-hidden />, title: 'Explainable', desc: 'AI menyebutkan alasan di balik saran—transparan & mudah dipercaya.' },
		{ icon: <Shield className="h-5 w-5" aria-hidden />, title: 'AI yang Aman', desc: 'Data belanja & invoice diproses dengan kontrol privasi berlapis.' },
		{ icon: <Rocket className="h-5 w-5" aria-hidden />, title: 'Menyatu dengan alur belanja', desc: 'Terhubung ke katalog, keranjang, checkout, & riwayat belanja.' },
	];

	return (
		<div ref={containerRef} className="relative" style={{ height: sectionHeight ? `${sectionHeight}px` : '200vh' }}>
			<div className="sticky top-0 h-screen overflow-hidden">
				<section aria-labelledby="adv-title" className="relative h-full flex items-center">
					<div className="pointer-events-none absolute inset-0">
						<div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 via-white to-violet-50/50 dark:from-violet-950/20 dark:via-neutral-950 dark:to-violet-950/20" />
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.12),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
					</div>

					<div className="relative w-full">
						<motion.div
							className="mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8 mb-16"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-100px' }}
							transition={{ duration: 0.6, ease: 'easeOut' }}
						>
							<motion.h2
								id="adv-title"
								className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.2 }}
							>
								Kenapa AI kami berbeda?
							</motion.h2>

							<motion.p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
								Bukan sekadar chatbot AI—kami paham konteks belanja & kebiasaanmu.
							</motion.p>
						</motion.div>

						<div className="overflow-hidden">
							<motion.div
								ref={trackRef}
								style={{ x, willChange: 'transform' }}
								className="
                  flex gap-6 pl-4 sm:pl-6 lg:pl-8
                  pr-[50vw] md:pr-[35vw] lg:pr-[25vw]
                "
							>
								{advantages.map((adv, index) => (
									<motion.div key={index} className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[55vw] lg:w-[35vw]" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
										<Adv icon={adv.icon} title={adv.title} desc={adv.desc} />
									</motion.div>
								))}
							</motion.div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
