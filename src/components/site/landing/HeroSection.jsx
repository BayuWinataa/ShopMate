'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import bg1 from '../../../../public/bg-1.svg';
import bg2 from '../../../../public/bg-2.svg';
import bg3 from '../../../../public/bg-3.svg';

export default function HeroSection() {
	return (
		<section aria-labelledby="hero-title" className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-neutral-950 dark:via-neutral-900/50 dark:to-neutral-950 min-h-[calc(100vh-4rem)]">
			{/* Animated Background SVGs - Scale cepat bergantian */}
			<motion.div initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 0.8, scale: 1 }} transition={{ duration: 0.4, delay: 0, ease: 'easeOut' }}>
				<Image src={bg1} alt="" priority aria-hidden="true" className="pointer-events-none select-none absolute top-0 -left-20 w-48 md:w-72 lg:w-96" />
			</motion.div>

			<motion.div initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 0.8, scale: 1 }} transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}>
				<Image src={bg2} alt="" priority aria-hidden="true" className="pointer-events-none select-none absolute top-0 -right-10 w-60 md:w-80 lg:w-[32rem]" />
			</motion.div>

			<motion.div initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 0.9, scale: 1 }} transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}>
				<Image src={bg3} alt="" priority aria-hidden="true" className="pointer-events-none select-none absolute bottom-0 -right-10 w-60 md:w-80 lg:w-[32rem]" />
			</motion.div>

			{/* Decorative gradient blobs */}
			<motion.div
				className="pointer-events-none absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
			/>
			<motion.div
				className="pointer-events-none absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl"
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
			/>

			{/* Content */}
			<div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-10 py-20 md:py-28 lg:py-32 flex flex-col items-center text-center justify-center min-h-[calc(100vh-4rem)]">
				{/* Title dengan animasi scale cepat */}
				<motion.h1
					id="hero-title"
					className="max-w-5xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-50"
					initial={{ opacity: 0, scale: 0.7 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
				>
					Belanja{' '}
					<motion.span
						className="bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent"
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.4, delay: 0.6, ease: 'easeOut' }}
					>
						lebih cerdas
					</motion.span>{' '}
					bersama AI
				</motion.h1>

				{/* Buttons dengan animasi scale cepat bergantian */}
				<div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
					<motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.7, ease: 'easeOut' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
						<Button
							asChild
							size="lg"
							className="w-full sm:w-auto font-semibold shadow-[0_4px_0_#6b21a8] hover:shadow-[0_6px_0_#6b21a8] active:shadow-none active:translate-y-[4px] bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 transition-all px-8"
						>
							<Link href="/products">
								Jelajahi Produk
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
					</motion.div>

					<motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.8, ease: 'easeOut' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
						<Button
							asChild
							size="lg"
							variant="outline"
							className="w-full sm:w-auto font-semibold border-2 border-violet-500 text-violet-600 hover:bg-violet-50 hover:border-violet-600 dark:hover:bg-violet-950/20 dark:border-violet-400 dark:text-violet-400 transition-all backdrop-blur-sm px-8"
						>
							<Link href="/chat">
								<MessageSquare className="mr-2 h-5 w-5" />
								Chat dengan AI
							</Link>
						</Button>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
