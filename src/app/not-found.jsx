import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50 px-4">
			<div className="text-center max-w-md">
				{/* 404 Number */}
				<div className="mb-8">
					<h1 className="text-9xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">404</h1>
				</div>

				{/* Message */}
				<h2 className="text-3xl font-bold text-violet-900 mb-4">Halaman Tidak Ditemukan</h2>
				<p className="text-violet-600 mb-8">Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.</p>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<Link href="/">
						<Button variant="pressPurple" className="rounded-full w-full sm:w-auto">
							Kembali ke Home
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
