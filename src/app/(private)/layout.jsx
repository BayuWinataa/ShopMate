// app/(site)/dashboard/layout.jsx
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Home, User, LogOut, Circle } from 'lucide-react';
import SidebarNav from '@/components/dashboard/SidebarNav';
import LogoutButton from '@/components/logout-button';

export const metadata = { title: 'Dashboard' };

export default function DashboardLayout({ children }) {
	return (
		<div className="h-[calc(100vh-4rem)] flex bg-gradient-to-br from-violet-50/30 to-purple-50/30">
			{/* Sidebar Desktop */}
			<aside className="hidden lg:flex w-64 flex-col border-r border-violet-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
				{/* Sidebar Header */}
				<div className="h-16 flex items-center justify-between px-6 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50">
					<Link href="/" className="group flex items-center gap-2 text-sm font-medium text-violet-900 hover:text-violet-700 transition-colors">
						<Home className="h-4 w-4 group-hover:scale-95 transition-transform" />
						Home
					</Link>
				</div>

				{/* Navigation */}
				<div className="flex-1 px-3 py-4">
					<SidebarNav />
				</div>

				{/* Sidebar Footer */}
				<div className="border-t border-violet-100 p-4 bg-violet-50/30">
					<LogoutButton className="w-full justify-start text-violet-700 hover:text-red-600 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors bg-transparent border-0 text-left flex items-center gap-2" />
				</div>
			</aside>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Top Navigation */}
				<header className="border-b border-violet-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
					{/* Mobile Menu */}
					<div className="lg:hidden">
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="hover:bg-violet-50 text-violet-600">
									<Menu className="h-5 w-5" />
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-64 p-0 border-violet-200">
								<SheetHeader className="sr-only">
									<SheetTitle>Dashboard Menu</SheetTitle>
								</SheetHeader>

								{/* Mobile Sidebar Header */}
								<div className="h-16 flex items-center justify-between px-6 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50">
									<Link href="/" className="flex items-center gap-2 text-sm font-medium text-violet-900">
										<Home className="h-4 w-4" />
										Home
									</Link>
								</div>

								{/* Mobile Navigation */}
								<div className="flex-1 px-3 py-4">
									<SidebarNav mobile />
								</div>

								{/* Mobile Footer */}
								<div className="border-t border-violet-100 p-4 bg-violet-50/30">
									<LogoutButton className="w-full justify-start text-violet-700 hover:text-red-600 hover:bg-red-100 px-3 py-2 rounded-xl bg-transparent border-0 text-left flex items-center gap-2" />
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</header>

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
