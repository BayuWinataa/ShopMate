'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/site/Header';
import Footer from '@/components/footer';

export default function SiteLayout({ children }) {
	const pathname = usePathname();
	const isChat = pathname === '/chat';

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1">{children}</main>
			{!isChat && <Footer />}
		</div>
	);
}
