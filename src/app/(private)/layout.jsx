// app/(site)/dashboard/layout.jsx
'use client';

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Home, User, LogOut, Circle } from 'lucide-react';
import SidebarNav from '@/components/dashboard/SidebarNav';
import LogoutButton from '@/components/logout-button';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function DashboardLayout({ children }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="h-[calc(100vh-4rem)] flex bg-gradient-to-br from-violet-50/30 to-purple-50/30">
			{/* Sidebar Desktop */}
			<motion.aside
				initial={{ x: -100, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
				className="hidden lg:flex w-64 flex-col border-r border-violet-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur"
			>
				{/* Sidebar Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.2 }}
					className="h-16 flex items-center justify-between px-6 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50"
				>
					<Link href="/" className="group flex items-center gap-2 text-sm font-medium text-violet-900 hover:text-violet-700 transition-colors">
						<motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
							<Home className="h-4 w-4" />
						</motion.div>
						Home
					</Link>
				</motion.div>

				{/* Navigation */}
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }} className="flex-1 px-3 py-4">
					<SidebarNav />
				</motion.div>

				{/* Sidebar Footer */}
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="border-t border-violet-100 p-4 bg-violet-50/30">
					<LogoutButton className="w-full justify-start text-violet-700 hover:text-red-600 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors bg-transparent border-0 text-left flex items-center gap-2" />
				</motion.div>
			</motion.aside>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Top Navigation */}
				<motion.header
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.4, delay: 0.1 }}
					className="border-b border-violet-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur"
				>
					{/* Mobile Menu */}
					<div className="lg:hidden">
						<Sheet open={isOpen} onOpenChange={setIsOpen}>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="hover:bg-violet-50 text-violet-600 relative overflow-hidden group" aria-label="Open menu">
									<div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									<motion.div
										animate={
											isOpen
												? {
														rotate: 90,
														scale: 1.1,
												  }
												: {
														rotate: 0,
														scale: 1,
												  }
										}
										transition={{ duration: 0.3 }}
									>
										<Menu className="h-5 w-5 relative z-10" />
									</motion.div>
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-64 p-0 border-violet-200">
								<SheetHeader className="sr-only">
									<SheetTitle>Dashboard Menu</SheetTitle>
								</SheetHeader>

								{/* Mobile Sidebar Header */}
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.3, delay: 0.1 }}
									className="h-16 flex items-center justify-between px-6 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50"
								>
									<Link href="/" className="flex items-center gap-2 text-sm font-medium text-violet-900">
										<motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
											<Home className="h-4 w-4" />
										</motion.div>
										Home
									</Link>
								</motion.div>

								{/* Mobile Navigation */}
								<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }} className="flex-1 px-3 py-4">
									<SidebarNav mobile onLinkClick={() => setIsOpen(false)} />
								</motion.div>

								{/* Mobile Footer */}
								<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }} className="border-t border-violet-100 p-4 bg-violet-50/30">
									<LogoutButton className="w-full justify-start text-violet-700 hover:text-red-600 hover:bg-red-100 px-3 py-2 rounded-xl bg-transparent border-0 text-left flex items-center gap-2" />
								</motion.div>
							</SheetContent>
						</Sheet>
					</div>
				</motion.header>

				{/* Page Content */}
				<main className="flex-1 overflow-auto">
					<div className="h-full p-6">
						<div className="h-full max-w-none">{children}</div>
					</div>
				</main>
			</div>
		</div>
	);
}
