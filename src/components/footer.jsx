'use client';

import Link from 'next/link';
import Sosmed from '@/components/site/sosmed';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export default function Footer() {
	const footerRef = useRef(null);
	const { scrollYProgress } = useScroll({
		target: footerRef,
		offset: ['start end', 'end end'],
	});

	const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
	const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
	const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

	return (
		<footer ref={footerRef} className="bg-violet-800 relative overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden">
				<motion.div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl" style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }} />
				<motion.div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" style={{ y: useTransform(scrollYProgress, [0, 1], [50, -50]) }} />
				<motion.div
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl"
					style={{
						scale: useTransform(scrollYProgress, [0, 1], [0.8, 1.2]),
						opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.3, 0.5]),
					}}
				/>
			</div>

			<motion.div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative z-10" style={{ y, opacity, scale }}>
				<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
					<motion.p className="text-5xl text-white font-bold" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: 'easeOut' }}>
						Shop Smarter. Live Brighter.
					</motion.p>
					<motion.div className="space-y-8" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}>
						<h3 className="text-lg font-semibold text-white">Contact</h3>

						<Link href="#">
							<Sosmed />
						</Link>
					</motion.div>
				</div>

				<motion.div className="mt-6 border-t border-white/10 pt-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}>
					<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
						<p className="text-md text-white">© {new Date().getFullYear()} Shopmate AI. All rights reserved.</p>
					</div>
				</motion.div>
			</motion.div>
		</footer>
	);
}
