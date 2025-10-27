'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Li from '@/components/site/landing/Li';
import { motion } from 'motion/react';

export default function InvoiceIQSection() {
	return (
		<section aria-labelledby="invoice-iq" className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
			{/* Animated background particles */}
			<motion.div className="absolute inset-0 -z-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
				{[...Array(5)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
						style={{
							left: `${20 + i * 15}%`,
							top: `${30 + i * 10}%`,
						}}
						animate={{
							y: [-20, 20, -20],
							opacity: [0.3, 0.6, 0.3],
							scale: [1, 1.5, 1],
						}}
						transition={{
							duration: 3 + i * 0.5,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
					/>
				))}
			</motion.div>

			<motion.div
				className="mx-auto max-w-6xl rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur supports-[backdrop-filter]:backdrop-blur md:p-10 relative overflow-hidden"
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}
			>
				{/* Animated gradient overlay */}
				<motion.div
					className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-purple-500/5 -z-10"
					animate={{
						x: ['-100%', '100%'],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: 'linear',
					}}
				/>

				<div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
					<motion.div className="max-w-2xl" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
						<motion.div
							className="inline-flex items-center gap-2 rounded-full bg-purple-600/10 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-600/20"
							initial={{ scale: 0, rotate: -180 }}
							whileInView={{ scale: 1, rotate: 0 }}
							viewport={{ once: true }}
							transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
						>
							<motion.span
								className="h-1.5 w-1.5 rounded-full bg-purple-700"
								aria-hidden
								animate={{
									scale: [1, 1.3, 1],
									opacity: [1, 0.6, 1],
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
								}}
							/>
							Fitur baru
						</motion.div>

						<motion.h3 id="invoice-iq" className="mt-3 text-2xl md:text-3xl font-bold tracking-tight" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
							<motion.span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent inline-block" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
								Invoice IQ
							</motion.span>{' '}
							— Tanyai Invoice, Jawab Instan
						</motion.h3>

						<motion.p className="mt-2 text-slate-600" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }}>
							Ingin mendapatkan insight dari pembelian anda, atau ingin sekedar meminta rekomendasi dari barang yang telah anda pesan sebelumnya?
						</motion.p>

						<motion.ul
							className="mt-4 grid gap-2 text-sm text-slate-700"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							variants={{
								hidden: { opacity: 0 },
								visible: {
									opacity: 1,
									transition: {
										staggerChildren: 0.1,
										delayChildren: 0.6,
									},
								},
							}}
						>
							{['Chatbot AI membaca detail pemesanan yang sudah anda beli', 'Bisa ditanya ulang soal item, harga, atau tanggal pesanan', 'Minta rekomendasi barang dari pemesanan anda sebelumnya'].map((text, index) => (
								<motion.li
									key={index}
									variants={{
										hidden: { opacity: 0, x: -20 },
										visible: { opacity: 1, x: 0 },
									}}
									transition={{ type: 'spring', stiffness: 100 }}
								>
									<Li>{text}</Li>
								</motion.li>
							))}
						</motion.ul>

						<motion.div className="mt-6 flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.9 }}>
							<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
								<Button asChild variant="pressPurple" className="rounded-full">
									<Link href="/dashboard/orders">Coba Invoice IQ</Link>
								</Button>
							</motion.div>
						</motion.div>
					</motion.div>

					{/* Mock preview with 3D effect */}
					<motion.div
						className="w-full max-w-md"
						initial={{ opacity: 0, x: 50, rotateY: -15 }}
						whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: 0.3 }}
						style={{ perspective: 1000 }}
					>
						<motion.div
							whileHover={{
								rotateY: 5,
								rotateX: -5,
								scale: 1.05,
							}}
							transition={{ type: 'spring', stiffness: 300, damping: 20 }}
						>
							<Card className="w-full bg-gradient-to-br from-indigo-50 to-purple-50 border-slate-200/80 shadow-xl shadow-purple-500/10">
								<CardContent className="p-4">
									<motion.div
										className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-700 shadow-sm"
										initial={{ scale: 0.8, opacity: 0 }}
										whileInView={{ scale: 1, opacity: 1 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: 0.5 }}
									>
										<motion.div className="mb-2 flex items-center justify-between" initial={{ y: -10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.7 }}>
											<span className="font-semibold">INV-2309</span>
											<motion.span className="rounded bg-slate-100 px-2 py-0.5" whileHover={{ scale: 1.1, backgroundColor: 'rgb(229, 231, 235)' }}>
												Tersimpan
											</motion.span>
										</motion.div>

										<motion.div
											className="rounded-lg border bg-slate-50 p-3"
											initial={{ scale: 0.9, opacity: 0 }}
											whileInView={{ scale: 1, opacity: 1 }}
											viewport={{ once: true }}
											transition={{ delay: 0.8 }}
											whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
										>
											<p className="font-medium">AI Insight</p>
											<motion.p className="mt-1 text-slate-600" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.9 }}>
												Total: <strong>Rp 1.950.000</strong>. Item terbesar: <strong>Headphone Pro</strong> (Rp 1.500.000). Metode: <strong>QRIS</strong>.
											</motion.p>
										</motion.div>

										<motion.div
											className="mt-3 flex justify-end text-sm font-medium cursor-pointer"
											initial={{ opacity: 0, x: 20 }}
											whileInView={{ opacity: 1, x: 0 }}
											viewport={{ once: true }}
											transition={{ delay: 1 }}
											whileHover={{ x: 5 }}
										>
											Tanya AI <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
										</motion.div>
									</motion.div>
								</CardContent>
							</Card>
						</motion.div>
					</motion.div>
				</div>
			</motion.div>
		</section>
	);
}
