'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Bot, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import CartButton from '@/components/cart/CartButton';
import { useAuth } from '@/lib/auth-context';
import { EmailAvatar } from '@/components/ui/avatar';

// util kecil untuk styling active link
function NavLink({ href, children }) {
	const pathname = usePathname();
	const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
	return (
		<Link href={href} aria-current={isActive ? 'page' : undefined} className={['relative rounded-md px-3 py-2 text-sm transition-colors', isActive ? 'text-violet-600 font-semibold' : 'text-foreground/70 hover:text-violet-600'].join(' ')}>
			<span className={['pointer-events-none absolute inset-x-2 -bottom-[2px] h-[2px] rounded-full transition-opacity', isActive ? 'opacity-100 bg-violet-600' : 'opacity-0'].join(' ')} />
			{children}
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
			className={[
				'sticky top-0 z-40 w-full transition-colors duration-300',
				scrolled
					? 
					  'border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50 shadow-sm'
					: 
					  'border-b border-transparent bg-none',
			].join(' ')}
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
					<div className="scale-110">
						<CartButton />
					</div>
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
				<div className="scale-110">
					<CartButton />
				</div>

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

// Sidebar mobile—tetap sama
function MobileMenu({ loading, user }) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden" aria-label="Buka menu">
					<Menu className="h-6 w-6" />
				</Button>
			</SheetTrigger>

			<SheetContent side="right" className="w-[320px] sm:w-[380px]">
				<SheetHeader>
					<SheetTitle>Menu</SheetTitle>
				</SheetHeader>

				<div className="mt-4">
					{loading ? (
						<div className="flex items-center gap-3 rounded-lg border p-3">
							<div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
							<div className="h-3 w-24 animate-pulse rounded bg-muted" />
						</div>
					) : user ? (
						<Link href="/dashboard" className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
							<EmailAvatar email={user.email} size="default" />
							<div className="grid">
								<span className="text-sm font-medium leading-none">Dashboard</span>
								<span className="text-xs text-muted-foreground">{user.email}</span>
							</div>
						</Link>
					) : (
						<div className="grid gap-2">
							<Link href="/login" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent">
								<LogIn size={16} />
								Login
							</Link>
							<Link href="/register" className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90">
								<UserPlus size={16} />
								Register
							</Link>
						</div>
					)}
				</div>

				<div className="mt-4 grid gap-1 border-t pt-4">
					<NavItem href="/">Beranda</NavItem>
					<NavItem href="/products">Produk</NavItem>
					<NavItem href="/chat">Chat AI</NavItem>
					{user && <NavItem href="/dashboard">Dashboard</NavItem>}
				</div>
			</SheetContent>
		</Sheet>
	);
}

function NavItem({ href, children }) {
	const pathname = usePathname();
	const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
	return (
		<Link href={href} className={['rounded-lg px-3 py-2 text-sm transition-colors', isActive ? 'bg-accent text-foreground' : 'text-foreground/80 hover:bg-accent'].join(' ')} aria-current={isActive ? 'page' : undefined}>
			{children}
		</Link>
	);
}
