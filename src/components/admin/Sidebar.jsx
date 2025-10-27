'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from 'lucide-react';

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
		{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/admin/products', label: 'Produk', icon: Package },
		{ href: '/admin/cart-items', label: 'Cart Items', icon: ShoppingCart },
		{ href: '/admin/customers', label: 'Pelanggan', icon: Users },
		{ href: '/admin/settings', label: 'Pengaturan', icon: Settings },
	];

	const handleLogout = async () => {
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
	};

	return (
		<aside className="w-48 sticky top-0 h-screen hidden md:flex flex-col border-r border-violet-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
			<div className="h-16 flex items-center px-4 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50">
				<Link href="/" className="text-lg font-bold text-violet-900">
					Admin
				</Link>
			</div>

			<nav className="flex-1 p-3 space-y-1">
				{navItems.map((item) => {
					const Icon = item.icon;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${pathname === item.href ? 'bg-violet-600 text-white shadow-md shadow-violet-200' : 'text-violet-700 hover:bg-violet-50 hover:text-violet-900'}`}
						>
							<Icon className="h-4 w-4" />
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>

			<div className="p-4 border-t border-violet-100">
				<Button variant="pressViolet" size="default" className="w-full" onClick={handleLogout}>
					Logout
				</Button>
			</div>
		</aside>
	);
}

// Export navItems for use in mobile menu
export const navItems = [
	{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
	{ href: '/admin/products', label: 'Produk', icon: Package },
	{ href: '/admin/cart-items', label: 'Cart Items', icon: ShoppingCart },
	{ href: '/admin/customers', label: 'Pelanggan', icon: Users },
	{ href: '/admin/settings', label: 'Pengaturan', icon: Settings },
];
