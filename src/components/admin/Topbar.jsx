import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { useState } from 'react';

export default function Topbar({ onLogout }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<header className="h-16 bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-violet-100 flex items-center justify-between px-4">
			<div className="flex items-center gap-2">
				{/* Mobile Menu */}
				<div className="md:hidden">
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="hover:bg-violet-50 text-violet-600 relative overflow-hidden group">
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
								<SheetTitle>Admin Menu</SheetTitle>
							</SheetHeader>
							<nav className="space-y-1 px-3 py-4">
								<Link href="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-violet-700 hover:bg-violet-50 hover:text-violet-900">
									Dashboard
								</Link>
								{/* Add other links here */}
							</nav>
						</SheetContent>
					</Sheet>
				</div>
				<h1 className="font-semibold text-violet-900">Panel Admin</h1>
			</div>

			<div className="flex items-center gap-3">
				<span className="hidden sm:inline text-sm text-violet-600">admin@gmail.com</span>
				<button onClick={onLogout} className="px-3 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors">
					Logout
				</button>
			</div>
		</header>
	);
}
