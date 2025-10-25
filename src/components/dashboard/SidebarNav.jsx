// components/dashboard/SidebarNav.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Receipt, MessageSquare, Settings, User, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

const LINKS = [
	{ href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
	{ href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
	{ href: '/dashboard/address', label: 'Address', icon: MapPin },
	// { href: '/dashboard/invoices', label: 'Invoices', icon: Receipt },
	// { href: '/dashboard/chat-history', label: 'Chat History', icon: MessageSquare },
	// { href: '/dashboard/profile', label: 'Profile', icon: User },
	// { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const item = {
	hidden: { opacity: 0, x: -20 },
	show: { opacity: 1, x: 0 },
};

export default function SidebarNav({ mobile = false, onLinkClick }) {
	const pathname = usePathname();

	const handleClick = () => {
		if (mobile && onLinkClick) {
			onLinkClick();
		}
	};

	return (
		<nav className={mobile ? 'px-4 py-3' : ''}>
			<motion.ul variants={container} initial="hidden" animate="show" className="space-y-1">
				{LINKS.map(({ href, label, icon: Icon }) => {
					const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
					return (
						<motion.li key={href} variants={item}>
							<Link
								href={href}
								onClick={handleClick}
								className={[
									'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
									active ? 'bg-violet-600 text-white shadow-md shadow-violet-200' : 'text-violet-700 hover:bg-violet-50 hover:text-violet-900',
								].join(' ')}
								aria-current={active ? 'page' : undefined}
							>
								<motion.div whileHover={{ scale: 1.2, rotate: active ? 0 : 10 }} whileTap={{ scale: 0.9 }} transition={{ type: 'spring', stiffness: 400 }}>
									<Icon className="h-4 w-4" />
								</motion.div>
								<span className="truncate">{label}</span>
								{active && <motion.div layoutId="activeIndicator" className="ml-auto h-2 w-2 rounded-full bg-white" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
							</Link>
						</motion.li>
					);
				})}
			</motion.ul>
		</nav>
	);
}
