import Link from 'next/link';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white flex items-center justify-center">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
				<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-violet-100 mb-6 ring-4 ring-violet-50">
					<Package className="h-10 w-10 text-violet-600" />
				</div>
				<h1 className="text-3xl md:text-4xl font-bold text-violet-900 mb-3">Produk tidak ditemukan</h1>
				<p className="text-lg text-violet-600/80 mb-8 max-w-md mx-auto">Produk yang kamu cari mungkin sudah tidak tersedia atau URL tidak valid.</p>
				<div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
					<Button asChild variant="pressPurple" size="lg">
						<Link href="/products">Lihat Semua Produk</Link>
					</Button>
					<Button asChild variant="pressPurple" size="lg" >
						<Link href="/">Kembali ke Beranda</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
