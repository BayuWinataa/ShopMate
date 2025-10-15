import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';

// Fungsi untuk mengambil data produk dari Supabase
async function getProducts() {
	const supabase = await createSupabaseServerClient();

	const { data, error } = await supabase.from('Products').select('nama,id').limit(6);

	if (error) {
		console.error('Error fetching products:', error);
		return [];
	}

	return data || [];
}

// Komponen utama untuk halaman Home
export default async function Home() {
	const products = await getProducts();

	return (
		<main className="min-h-screen bg-gray-50 p-6">
			<div className="mx-auto max-w-6xl">
				<div className="bg-white rounded-xl shadow p-6 mb-8">
					<h1 className="text-3xl font-bold mb-2 text-gray-900">Daftar Produk</h1>
					<p className="text-gray-600">Temukan produk terbaik untuk kebutuhan Anda</p>
				</div>

				{/* Menampilkan produk */}
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{products.length === 0 ? (
						<div className="col-span-full bg-white rounded-xl shadow p-8 text-center">
							<div className="text-gray-400 mb-4">
								<svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m4 0h2a2 2 0 012 2v4M6 13h2" />
								</svg>
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada produk</h3>
							<p className="text-gray-500">Belum ada produk yang tersedia saat ini.</p>
						</div>
					) : (
						products.map((product) => (
							<div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
								<div className="p-4">
									<h3 className="text-lg font-semibold text-gray-900 mb-2">{product.nama}</h3>
								</div>
							</div>
						))
					)}
				</div>

				{/* Call to Action */}
				<div className="mt-12 bg-indigo-50 rounded-xl p-8 text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">Ingin menambahkan produk?</h2>
					<p className="text-gray-600 mb-6">Kelola produk Anda dengan mudah melalui dashboard admin.</p>
					<Link href="/dashboard" className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
						Ke Dashboard
					</Link>
				</div>
			</div>
		</main>
	);
}
