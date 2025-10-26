'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export default function SplashScreen({ onComplete }) {
	const [isVisible, setIsVisible] = useState(true);
	const [showContent, setShowContent] = useState(false);
	const [particles, setParticles] = useState([]);

	useEffect(() => {
		// Generate particles on client side only to avoid hydration mismatch
		const generatedParticles = [...Array(20)].map((_, i) => ({
			id: i,
			left: `${Math.random() * 100}%`,
			top: `${Math.random() * 100}%`,
		}));
		setParticles(generatedParticles);

		// Always show splash screen on page load
		// Start animation sequence
		const timer1 = setTimeout(() => setShowContent(true), 500);
		const timer2 = setTimeout(() => {
			setIsVisible(false);
			onComplete();
		}, 3500);

		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
		};
	}, [onComplete]);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.5,
				staggerChildren: 0.1,
			},
		},
		exit: {
			opacity: 0,
			scale: 1.1,
			transition: { duration: 0.8, ease: 'easeInOut' },
		},
	};

	const letterVariants = {
		hidden: { y: 50, opacity: 0, rotateX: -90 },
		visible: {
			y: 0,
			opacity: 1,
			rotateX: 0,
			transition: {
				duration: 0.8,
				ease: 'easeOut',
			},
		},
	};

	const particleVariants = {
		hidden: { scale: 0, opacity: 0 },
		visible: (i) => ({
			scale: 1,
			opacity: [0, 1, 0.5, 1],
			x: [0, Math.random() * 100 - 50, Math.random() * 200 - 100],
			y: [0, Math.random() * 100 - 50, Math.random() * 200 - 100],
			transition: {
				duration: 3,
				delay: i * 0.1,
				repeat: Infinity,
				repeatType: 'reverse',
			},
		}),
	};

	const text = 'ShopMate AI';
	const letters = text.split('');

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 overflow-hidden" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
					{/* Animated background particles */}
					<div className="absolute inset-0">
						{particles.map((particle) => (
							<motion.div
								key={particle.id}
								className="absolute w-2 h-2 bg-white/20 rounded-full"
								style={{
									left: particle.left,
									top: particle.top,
								}}
								variants={particleVariants}
								initial="hidden"
								animate="visible"
								custom={particle.id}
							/>
						))}
					</div>

					{/* Geometric shapes */}
					<motion.div
						className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-violet-300/30 rounded-full"
						animate={{
							scale: [1, 1.2, 1],
							rotate: [0, 180, 360],
							opacity: [0.3, 0.6, 0.3],
						}}
						transition={{
							duration: 4,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
					/>
					<motion.div
						className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-pink-500/20 to-violet-500/20 transform rotate-45"
						animate={{
							scale: [1, 1.3, 1],
							rotate: [45, 135, 225, 315, 45],
						}}
						transition={{
							duration: 6,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
					/>

					{/* Main content */}
					<div className="relative z-10 text-center">
						{showContent && (
							<motion.div variants={containerVariants} initial="hidden" animate="visible">
								{/* Logo/Icon */}
								<motion.div className="mb-8" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 1, delay: 0.5, type: 'spring', bounce: 0.4 }}>
									<div className="w-24 h-24 mx-auto bg-gradient-to-r from-violet-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl">
										<svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
										</svg>
									</div>
								</motion.div>

								{/* Animated text */}
								<div className="flex justify-center space-x-1 mb-4">
									{letters.map((letter, index) => (
										<motion.span
											key={index}
											className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg"
											variants={letterVariants}
											style={{
												textShadow: '0 0 20px rgba(255,255,255,0.5)',
											}}
										>
											{letter === ' ' ? '\u00A0' : letter}
										</motion.span>
									))}
								</div>

								{/* Subtitle */}
								<motion.p className="text-xl md:text-2xl text-violet-200 font-light" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 2 }}>
									AI-Powered Shopping Experience
								</motion.p>

								{/* Loading indicator */}
								<motion.div className="mt-8 flex justify-center space-x-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
									{[0, 1, 2].map((i) => (
										<motion.div
											key={i}
											className="w-3 h-3 bg-violet-300 rounded-full"
											animate={{
												scale: [1, 1.5, 1],
												opacity: [0.5, 1, 0.5],
											}}
											transition={{
												duration: 1.5,
												repeat: Infinity,
												delay: i * 0.2,
											}}
										/>
									))}
								</motion.div>
							</motion.div>
						)}
					</div>

					{/* Gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none" />
				</motion.div>
			)}
		</AnimatePresence>
	);
}
