'use client';

import { useRef, useLayoutEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import Step from '@/components/site/landing/Step';

export default function FlowSection() {
	const containerRef = useRef(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start start', 'end end'],
	});

	const steps = [
		{ num: '01', title: 'Temukan & Pilih', desc: 'Cari produk dengan mudah, gunakan filter atau sort, lalu lihat detail spesifikasinya.' },
		{ num: '02', title: 'Chat & Bandingkan', desc: 'Tanya AI untuk rekomendasi, atau bandingkan dua produk secara instan.' },
		{ num: '03', title: 'Checkout', desc: 'Selesaikan pesanan dengan proses yang cepat dan aman.' },
		{ num: '04', title: 'Invoice IQ', desc: 'Dapatkan insight cerdas dari riwayat pembelianmu.' },
	];

	const [sectionHeight, setSectionHeight] = useState('500vh');
	useLayoutEffect(() => {
		const measure = () => {
			const vh = window.innerHeight;
			const total = vh * (steps.length + 1);
			setSectionHeight(`${total}px`);
		};
		measure();
		const onResize = () => measure();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	const makeStepMotion = (i) => {
		const n = steps.length;
		const start = (i + 0.0) / (n + 0.00001);
		const end = (i + 1.0) / (n + 0.00001);

		const opacity = useTransform(scrollYProgress, [start, start + 0.12, end - 0.12, end], [0, 1, 1, 0]);
		const y = useTransform(scrollYProgress, [start, end], [30, -30]);
		const scale = useTransform(scrollYProgress, [start, (start + end) / 2, end], [0.98, 1, 0.98]);

		return { opacity, y, scale };
	};

	const progressH = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

	return (
		<section aria-labelledby="flow-title" ref={containerRef} className="relative" style={{ height: sectionHeight }}>
			<div className="sticky top-0 h-screen">
				<motion.div
					aria-hidden
					className="pointer-events-none absolute inset-0"
					style={{
						background: 'radial-gradient(60% 50% at 30% 20%, rgba(139,92,246,0.10), transparent 60%), radial-gradient(60% 50% at 80% 80%, rgba(79,70,229,0.10), transparent 60%)',
					}}
				/>

				<div className="container mx-auto px-4 sm:px-6 lg:px-8 h-[35vh] flex items-end">
					<div className="mx-auto max-w-4xl text-center">
						<h2 id="flow-title" className="text-3xl md:text-4xl font-bold tracking-tight">
							Cara kerja yang simpel ✨
						</h2>
						<p className="mt-3"></p>
					</div>
				</div>

				<div className="relative h-[65vh]">
					<div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
						<div className="h-64 w-1 rounded bg-slate-200/70 overflow-hidden">
							<motion.div className="w-full bg-gradient-to-b from-purple-500 to-indigo-500" style={{ height: progressH }} />
						</div>
					</div>

					<div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full relative">
						{steps.map((s, i) => {
							const m = makeStepMotion(i);
							return (
								<motion.div key={i} style={m} className="absolute inset-0 flex items-center justify-center">
									<div className="w-full max-w-4xl">
										<div className="mb-4 flex justify-center">
											<Badge className="bg-purple-600/10 text-purple-700 ring-1 ring-purple-600/20">Langkah {s.num}</Badge>
										</div>

										<div className="mx-auto max-w-3xl">
											<Step num={s.num} title={s.title} desc={s.desc} />
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
