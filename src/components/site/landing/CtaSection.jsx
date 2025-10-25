'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function CtaSection() {
	return (
		<section aria-labelledby="cta-title" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
			{/* Animated background blobs */}
			<div className="absolute inset-0 -z-10">
				{[...Array(4)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute rounded-full blur-3xl"
						style={{
							width: `${200 + i * 50}px`,
							height: `${200 + i * 50}px`,
							left: `${10 + i * 25}%`,
							top: `${20 + i * 15}%`,
							background: i % 2 === 0 ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.15))' : 'linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(79, 70, 229, 0.15))',
						}}
						animate={{
							scale: [1, 1.2, 1],
							opacity: [0.3, 0.5, 0.3],
							x: [0, 30, 0],
							y: [0, -30, 0],
						}}
						transition={{
							duration: 8 + i * 2,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
					/>
				))}
			</div>

			<motion.div
				className="mx-auto max-w-4xl rounded-3xl border border-slate-200/80 bg-white/70 p-8 text-center shadow-lg backdrop-blur supports-[backdrop-filter]:backdrop-blur relative overflow-hidden"
				initial={{ opacity: 0, scale: 0.9, y: 50 }}
				whileInView={{ opacity: 1, scale: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}
			>
				{/* Animated shine effect */}
				<motion.div
					className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"
					animate={{
						x: ['-100%', '100%'],
					}}
					transition={{
						duration: 3,
						repeat: Infinity,
						ease: 'linear',
						repeatDelay: 2,
					}}
				/>

				{/* Pulsing glow ring */}
				<motion.div
					className="absolute inset-0 rounded-3xl"
					animate={{
						boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0)', '0 0 0 8px rgba(59, 130, 246, 0.1)', '0 0 0 0 rgba(59, 130, 246, 0)'],
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				/>

				<motion.h3
					id="cta-title"
					className="text-2xl md:text-3xl font-bold tracking-tight relative z-10"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					Siap belanja dengan{' '}
					<motion.span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent inline-block" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
						ShopMate AI
					</motion.span>
					?
				</motion.h3>

				<motion.p className="mx-auto mt-2 max-w-xl text-slate-600 relative z-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
					Coba sekarang dan rasakan belanja yang cepat, akurat, dan menyenangkan. AI yang paham kebutuhanmu.
				</motion.p>

				<motion.div
					className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row relative z-10"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
						<Button asChild variant="pressPurple" size="lg" className="font-semibold relative overflow-hidden group rounded-full">
							<Link href="/products" className="flex items-center">
								<span className="relative z-10">Lihat Katalog</span>
								<motion.div
									className="relative z-10"
									animate={{
										x: [0, 4, 0],
									}}
									transition={{
										duration: 1.5,
										repeat: Infinity,
										ease: 'easeInOut',
									}}
								>
									<ArrowRight className="ml-2 h-4 w-4" aria-hidden />
								</motion.div>
								{/* Button shine effect */}
								<motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.6 }} />
							</Link>
						</Button>
					</motion.div>
				</motion.div>

				{/* Decorative corners */}
				<motion.div
					className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-transparent rounded-br-full"
					initial={{ scale: 0, opacity: 0 }}
					whileInView={{ scale: 1, opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.6 }}
				/>
				<motion.div
					className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-indigo-500/20 to-transparent rounded-tl-full"
					initial={{ scale: 0, opacity: 0 }}
					whileInView={{ scale: 1, opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.6 }}
				/>
			</motion.div>
		</section>
	);
}
