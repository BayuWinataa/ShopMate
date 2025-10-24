'use client';

import Link from 'next/link';
import Sosmed from '@/components/site/sosmed';

export default function Footer() {
	return (
		<footer className="bg-violet-800 ">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
					<p className="text-5xl text-white font-bold">Shop Smarter. Live Brighter.</p>
					<div className="space-y-8">
						
							<h3 className="text-lg font-semibold text-white">Contact</h3>
						
						<Link href="#">
							<Sosmed />
						</Link>
					</div>
				</div>
				{/* Bottom bar */}
				<div className="mt-6 border-t border-white/10 pt-6">
					<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
						<p className="text-md text-white">© {new Date().getFullYear()} Shopmate AI. All rights reserved.</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
