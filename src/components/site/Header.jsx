'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Bot, LogIn, UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import CartButton from '@/components/cart/CartButton';
import { useAuth } from '@/lib/auth-context';
import { EmailAvatar } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'motion/react';

// util kecil untuk styling active link - Desktop
function NavLink({ href, children }) {
	const pathname = usePathname();
	const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
	return (
		<Link
			href={href}
			aria-current={isActive ? 'page' : undefined}
			className={['relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300', isActive ? 'text-violet-600 bg-violet-500/10 shadow-sm' : 'text-foreground/70 hover:text-violet-600 hover:bg-violet-500/5'].join(' ')}
		>
			{children}
			{/* Active indicator */}
			{isActive && <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-violet-600" />}
		</Link>
	);
}

export default function Header() {
	const { user, loading } = useAuth();
	const [mounted, setMounted] = useState(false);

	// ⬇️ NEW: state untuk apakah sudah discroll
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		setMounted(true);

		// handler scroll yang ringan (dibungkus rAF biar hemat)
		let ticking = false;
		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					setScrolled(window.scrollY > 2);
					ticking = false;
				});
				ticking = true;
			}
		};

		// set awal (misal reload di tengah halaman)
		setScrolled(window.scrollY > 2);

		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	// ⬇️ UPDATE: Shell sekarang menerima prop `scrolled`
	const Shell = ({ children, scrolled }) => (
		<header
			className={['sticky top-0 z-40 w-full transition-colors duration-300', scrolled ? 'border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50 shadow-sm' : 'border-b border-transparent bg-none'].join(' ')}
		>
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between gap-3">{children}</div>
			</div>
		</header>
	);

	if (!mounted) {
		return (
			<Shell scrolled={false}>
				{/* Brand */}
				<div className="flex min-w-0 items-center gap-2">
					<Link href="/" className="group inline-flex items-center">
						<span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500/10 text-violet-600 ring-1 ring-violet-500/25 transition-colors group-hover:bg-violet-500/15">
							<Bot className="h-7 w-7" />
						</span>
						<span className="truncate text-xl font-extrabold tracking-tight">ShopMate</span>
						<span className="hidden rounded-md bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700 ring-1 ring-violet-500/10 md:inline-block">AI</span>
					</Link>
				</div>

				{/* Desktop nav */}
				<nav className="hidden items-center gap-1 md:flex">
					<NavLink href="/">Home</NavLink>
					<NavLink href="/products">Produk</NavLink>
					<NavLink href="/chat">Chat AI</NavLink>
				</nav>

				{/* Actions */}
				<div className="flex items-center gap-3">
					<div className="hidden md:block h-10 w-10 animate-pulse bg-gray-200 rounded-full" />
					<MobileMenu loading user={null} />
				</div>
			</Shell>
		);
	}

	return (
		<Shell scrolled={scrolled}>
			{/* Brand */}
			<div className="flex min-w-0 items-center gap-2">
				<Link href="/" className="group inline-flex items-center gap-2">
					<span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500/10 text-violet-600 ring-1 ring-violet-500/25 transition-colors group-hover:bg-violet-500/15">
						<Bot className="h-7 w-7" />
					</span>
					<span className="relative inline-block">
						<span className="truncate pr-5 text-xl sm:text-2xl font-extrabold tracking-tight text-violet-600 leading-none">ShopMate</span>
						<span className="pointer-events-none select-none absolute -top-1.5 right-1 sm:-top-2 sm:right-0 md:-top-2.5 md:-right-0.5 text-[9px] sm:text-[10px] md:text-[11px] font-semibold text-violet-500">AI</span>
					</span>
				</Link>
			</div>

			{/* Desktop nav */}
			<nav className="hidden items-center gap-1 md:flex">
				<NavLink href="/">Home</NavLink>
				<NavLink href="/products">Produk</NavLink>
				<NavLink href="/chat">Chat AI</NavLink>
			</nav>

			{/* Actions */}
			<div className="flex items-center gap-3">
				{user && (
					<div className="scale-110">
						<CartButton />
					</div>
				)}

				{loading ? (
					<div className="hidden md:block h-10 w-10 animate-pulse bg-gray-200 rounded-full" />
				) : user ? (
					<Link href="/dashboard" className="hidden md:block rounded-lg p-1 transition btn-press">
						<EmailAvatar email={user.email} size="default" />
					</Link>
				) : (
					<div className="hidden md:flex items-center gap-2">
						<Link href="/login">
							<Button variant="pressPurple" size="sm" className="gap-2">
								<LogIn size={16} />
								<span className="hidden sm:inline">Login</span>
							</Button>
						</Link>
						<Link href="/register">
							<Button variant="pressPurple" size="sm" className="gap-2">
								<UserPlus size={16} />
								<span className="hidden sm:inline">Register</span>
							</Button>
						</Link>
					</div>
				)}

				<MobileMenu loading={loading} user={user} />
			</div>
		</Shell>
	);
}

// Simple Hamburger Button tanpa animasi
function SimpleHamburger({ isOpen }) {
	return (
		<div className="relative w-6 h-6 flex flex-col justify-center items-center">
			{/* Top line */}
			<span className={`absolute w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`} />
			{/* Middle line */}
			<span className={`absolute w-6 h-0.5 bg-current rounded-full transition-all duration-200 ease-in-out ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} />
			{/* Bottom line */}
			<span className={`absolute w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${isOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`} />
		</div>
	);
}

// Sidebar mobile dengan animasi super keren! 🎨✨
function MobileMenu({ loading, user }) {
	const [isOpen, setIsOpen] = useState(false);
	const [hasBeenOpened, setHasBeenOpened] = useState(false);

	// Track when menu is opened for the first time
	useEffect(() => {
		if (isOpen && !hasBeenOpened) {
			setHasBeenOpened(true);
		}
	}, [isOpen, hasBeenOpened]);

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden relative overflow-hidden group text-violet-600 hover:text-violet-700" aria-label="Buka menu">
					<div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
					<SimpleHamburger isOpen={isOpen} />
				</Button>
			</SheetTrigger>

			<SheetContent side="right" className="w-[320px] sm:w-[380px] p-0 overflow-hidden" hideCloseButton={true}>
				{/* Animated Close Button (X) */}
				<SheetClose asChild>
					<motion.button
						className="ring-offset-background absolute top-4 right-4 rounded-full p-2 opacity-70 transition-all hover:opacity-100 hover:bg-violet-500/10 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none z-50"
						initial={hasBeenOpened ? { scale: 0, rotate: -180 } : { scale: 1, rotate: 0 }}
						animate={{ scale: 1, rotate: 0 }}
						transition={hasBeenOpened ? { type: 'spring', stiffness: 200, damping: 15, delay: 0.3 } : { duration: 0 }}
						whileHover={{ scale: 1.1, rotate: 90 }}
						whileTap={{ scale: 0.9, rotate: 180 }}
						aria-label="Close menu"
					>
						<X className="h-5 w-5 text-violet-600" />
					</motion.button>
				</SheetClose>

				{/* Animated Background Gradient - hanya animate jika sudah pernah dibuka */}
				<motion.div
					className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-fuchsia-500/5 -z-10"
					animate={
						hasBeenOpened
							? {
									background: [
										'linear-gradient(to bottom right, rgba(139, 92, 246, 0.05), rgba(168, 85, 247, 0.05), rgba(217, 70, 239, 0.05))',
										'linear-gradient(to bottom right, rgba(217, 70, 239, 0.05), rgba(139, 92, 246, 0.05), rgba(168, 85, 247, 0.05))',
										'linear-gradient(to bottom right, rgba(168, 85, 247, 0.05), rgba(217, 70, 239, 0.05), rgba(139, 92, 246, 0.05))',
									],
							  }
							: {}
					}
					transition={hasBeenOpened ? { duration: 8, repeat: Infinity, ease: 'linear' } : {}}
				/>

				<div className="p-6 h-full flex flex-col">
					{/* Header dengan animasi - hanya jika sudah pernah dibuka */}
					<motion.div initial={hasBeenOpened ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }} transition={hasBeenOpened ? { duration: 0.4, delay: 0.1 } : { duration: 0 }}>
						<SheetHeader className="mb-6">
							<motion.div initial={hasBeenOpened ? { scale: 0.8 } : { scale: 1 }} animate={{ scale: 1 }} transition={hasBeenOpened ? { type: 'spring', stiffness: 200, damping: 15, delay: 0.2 } : { duration: 0 }}>
								<SheetTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Menu</SheetTitle>
							</motion.div>
						</SheetHeader>
					</motion.div>

					{/* User Section dengan animasi - hanya jika sudah pernah dibuka */}
					<motion.div
						initial={hasBeenOpened ? { opacity: 0, x: 50 } : { opacity: 1, x: 0 }}
						animate={{ opacity: 1, x: 0 }}
						transition={hasBeenOpened ? { duration: 0.5, delay: 0.2, type: 'spring', stiffness: 100 } : { duration: 0 }}
						className="mb-6"
					>
						{loading ? (
							<motion.div className="flex items-center gap-3 rounded-xl border p-4 bg-gradient-to-r from-violet-500/5 to-purple-500/5" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
								<div className="h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-violet-400/20 to-purple-400/20" />
								<div className="h-3 w-24 animate-pulse rounded bg-muted" />
							</motion.div>
						) : user ? (
							<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
								<Link
									href="/dashboard"
									className="flex items-center gap-3 rounded-xl border p-4 hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-purple-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20 group"
									onClick={() => setIsOpen(false)}
								>
									<motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
										<EmailAvatar email={user.email} size="default" />
									</motion.div>
									<div className="grid">
										<span className="text-sm font-semibold leading-none group-hover:text-violet-600 transition-colors">Dashboard</span>
										<span className="text-xs text-muted-foreground mt-1">{user.email}</span>
									</div>
								</Link>
							</motion.div>
						) : (
							<div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
								<motion.div
									initial={hasBeenOpened ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
									animate={{ opacity: 1, x: 0 }}
									transition={hasBeenOpened ? { delay: 0.3 } : { duration: 0 }}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className="flex-1 xs:flex-initial"
								>
									<Link href="/login" onClick={() => setIsOpen(false)} className="block">
										<Button variant="pressPurple" size="sm" className="gap-2 w-full xs:w-auto">
											<motion.div animate={hasBeenOpened ? { rotate: [0, 10, -10, 0] } : {}} transition={hasBeenOpened ? { duration: 0.5, repeat: Infinity, repeatDelay: 3 } : {}}>
												<LogIn size={16} />
											</motion.div>
											Login
										</Button>
									</Link>
								</motion.div>
								<motion.div
									initial={hasBeenOpened ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
									animate={{ opacity: 1, x: 0 }}
									transition={hasBeenOpened ? { delay: 0.4 } : { duration: 0 }}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className="flex-1 xs:flex-initial"
								>
									<Link href="/register" onClick={() => setIsOpen(false)} className="block">
										<Button variant="pressPurple" size="sm" className="gap-2 w-full xs:w-auto">
											<motion.div animate={hasBeenOpened ? { scale: [1, 1.2, 1] } : {}} transition={hasBeenOpened ? { duration: 0.5, repeat: Infinity, repeatDelay: 3 } : {}}>
												<UserPlus size={16} />
											</motion.div>
											Register
										</Button>
									</Link>
								</motion.div>
							</div>
						)}
					</motion.div>

					{/* Navigation dengan animasi stagger - hanya jika sudah pernah dibuka */}
					<motion.div
						className="flex-1 border-t pt-6"
						initial={hasBeenOpened ? 'hidden' : 'visible'}
						animate="visible"
						variants={{
							hidden: { opacity: 0 },
							visible: {
								opacity: 1,
								transition: hasBeenOpened
									? {
											staggerChildren: 0.08,
											delayChildren: 0.3,
									  }
									: { duration: 0 },
							},
						}}
					>
						<div className="grid gap-2">
							<AnimatedNavItem href="/" icon="🏠" onClick={() => setIsOpen(false)} hasBeenOpened={hasBeenOpened}>
								Beranda
							</AnimatedNavItem>
							<AnimatedNavItem href="/products" icon="🛍️" onClick={() => setIsOpen(false)} hasBeenOpened={hasBeenOpened}>
								Produk
							</AnimatedNavItem>
							<AnimatedNavItem href="/chat" icon="💬" onClick={() => setIsOpen(false)} hasBeenOpened={hasBeenOpened}>
								Chat AI
							</AnimatedNavItem>
							{user && (
								<AnimatedNavItem href="/dashboard" icon="📊" onClick={() => setIsOpen(false)} hasBeenOpened={hasBeenOpened}>
									Dashboard
								</AnimatedNavItem>
							)}
						</div>
					</motion.div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

// Animated Navigation Item dengan efek super smooth
function AnimatedNavItem({ href, children, icon, onClick, hasBeenOpened }) {
	const pathname = usePathname();
	const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

	return (
		<motion.div
			variants={{
				hidden: { opacity: 0, x: -20 },
				visible: { opacity: 1, x: 0 },
			}}
			whileHover={{ x: 5 }}
			whileTap={{ scale: 0.95 }}
		>
			<Link
				href={href}
				onClick={onClick}
				className={[
					'relative overflow-hidden rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 flex items-center gap-3 group',
					isActive ? 'bg-gradient-to-r from-violet-500/15 to-purple-500/15 text-violet-600 shadow-lg shadow-violet-500/10' : 'text-foreground/70 hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-purple-500/10 hover:text-violet-600',
				].join(' ')}
				aria-current={isActive ? 'page' : undefined}
			>
				{/* Animated background shimmer effect */}
				<motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.6, ease: 'easeInOut' }} />

				{/* Icon dengan animasi - hanya jika sudah pernah dibuka */}
				<motion.span className="text-xl" animate={isActive && hasBeenOpened ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}} transition={hasBeenOpened ? { duration: 0.5 } : {}}>
					{icon}
				</motion.span>

				<span className="relative z-10">{children}</span>

				{/* Active indicator dengan animasi - hanya jika sudah pernah dibuka */}
				{isActive && (
					<motion.div
						className="absolute right-2 w-2 h-2 rounded-full bg-violet-500"
						animate={
							hasBeenOpened
								? {
										scale: [1, 1.5, 1],
										opacity: [1, 0.5, 1],
								  }
								: {}
						}
						transition={
							hasBeenOpened
								? {
										duration: 2,
										repeat: Infinity,
										ease: 'easeInOut',
								  }
								: {}
						}
					/>
				)}
			</Link>
		</motion.div>
	);
}
