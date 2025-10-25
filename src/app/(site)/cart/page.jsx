import { Suspense } from 'react';
import ClientCartPage from '@/components/cart/client-cart';

export const dynamic = 'force-dynamic';

export const metadata = {
	title: 'Keranjang · ShopMate',
	description: 'Tinjau item di keranjang belanja Anda sebelum checkout.',
};

export default function CartPage() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<h1 className="text-2xl md:text-3xl font-bold tracking-tight text-violet-800">Keranjang Belanja</h1>
				<p className="mt-1 text-sm text-violet-600">Periksa kembali item, ubah jumlah, atau lanjutkan ke pembayaran.</p>

				<Suspense fallback={<p className="mt-6 text-sm text-violet-600">Memuat keranjang…</p>}>
					<ClientCartPage />
				</Suspense>
			</div>
		</div>
	);
}
