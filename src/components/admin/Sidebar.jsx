'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
	const pathname = usePathname();
	// Try to get signOut from AuthProvider; some layouts don't provide it and
	// use sessionStorage-based auth instead. Protect against useAuth() throwing.
	let signOut;
	try {
		const auth = useAuth();
		signOut = auth?.signOut;
	} catch (e) {
		signOut = undefined;
	}
	const router = useRouter();

	const navItems = [
		{ href: '/admin', label: 'Dashboard' },
		{ href: '/admin/products', label: 'Produk' },
		{ href: '/admin/cart-items', label: 'Cart Items' },
		{ href: '/admin/customers', label: 'Pelanggan' },
		{ href: '/admin/settings', label: 'Pengaturan' },
	];

	return (
		<aside className="w-48 sticky top-0 h-screen hidden md:flex flex-col border-r border-violet-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
			<div className="h-16 flex items-center px-4 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50">
				<Link href="/" className="text-lg font-bold text-violet-900">
					Admin
				</Link>
			</div>

			<nav className="flex-1 p-3 space-y-1">
				{navItems.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className={`block px-3 py-2 rounded-lg transition-colors ${pathname === item.href ? 'bg-violet-600 text-white shadow-md shadow-violet-200' : 'text-violet-700 hover:bg-violet-50 hover:text-violet-900'}`}
					>
						{item.label}
					</Link>
				))}
			</nav>

			<div className="p-4 border-t border-violet-100">
				<Button
					variant="pressViolet"
					size="default"
					className="w-full"
					onClick={async () => {
						if (typeof signOut === 'function') {
							try {
								await signOut();
							} catch (e) {
								console.error('signOut error', e);
							}
						}
						try {
							sessionStorage.removeItem('adminAuth');
						} catch (e) {
							console.error('sessionStorage error', e);
						}
						router.push('/');
					}}
				>
					Logout
				</Button>
			</div>
		</aside>
	);
}
