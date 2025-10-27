'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '@/components/loader';
import Sidebar, { navItems } from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
	const { isAuthenticated, isLoading, handleLogout } = useAdminAuth();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	if (isLoading) {
		return <Loader />;
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-violet-50/30 to-purple-50/30 flex">
			<Sidebar />
			<div className="flex-1 flex flex-col">
				{/* Mobile Header */}
				<header className="md:hidden h-16 bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-violet-100 flex items-center justify-between px-4 sticky top-0 z-40">
					<div className="flex items-center gap-2">
						<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="hover:bg-violet-50 text-violet-600">
									<Menu className="h-5 w-5" />
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-64 p-0 border-violet-200">
								<SheetHeader className="h-16 flex items-center px-4 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50">
									<SheetTitle className="text-lg font-bold text-violet-900">Admin</SheetTitle>
								</SheetHeader>
								<MobileNav handleLogout={handleLogout} setMobileMenuOpen={setMobileMenuOpen} />
							</SheetContent>
						</Sheet>
						<h1 className="font-semibold text-violet-900">Panel Admin</h1>
					</div>
					<Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-violet-50 text-violet-600">
						<LogOut className="h-5 w-5" />
					</Button>
				</header>

				<main className="flex-1 overflow-auto">
					<div className="h-full p-4 md:p-6">
						<div className="h-full max-w-none">{children}</div>
					</div>
				</main>
			</div>
		</div>
	);
}

function MobileNav({ handleLogout, setMobileMenuOpen }) {
	const pathname = usePathname();
	const router = useRouter();

	return (
		<div className="flex flex-col h-[calc(100vh-4rem)]">
			<nav className="flex-1 p-3 space-y-1">
				{navItems.map((item) => {
					const Icon = item.icon;
					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={() => setMobileMenuOpen(false)}
							className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === item.href ? 'bg-violet-600 text-white shadow-md shadow-violet-200' : 'text-violet-700 hover:bg-violet-50 hover:text-violet-900'}`}
						>
							<Icon className="h-5 w-5" />
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>
			<div className="p-4 border-t border-violet-100">
				<Button
					variant="pressViolet"
					size="default"
					className="w-full"
					onClick={() => {
						setMobileMenuOpen(false);
						handleLogout();
					}}
				>
					Logout
				</Button>
			</div>
		</div>
	);
}

function useAdminAuth() {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check if admin is authenticated via sessionStorage
		const adminAuth = sessionStorage.getItem('adminAuth');

		if (adminAuth !== 'true') {
			// Redirect to login if not authenticated
			router.replace('/login');
		} else {
			setIsAuthenticated(true);
		}
		setIsLoading(false);
	}, [router]);

	const handleLogout = () => {
		sessionStorage.removeItem('adminAuth');
		router.push('/login');
	};

	return { isAuthenticated, isLoading, handleLogout };
}
