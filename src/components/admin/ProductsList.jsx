'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { formatIDR } from '@/lib/formatIDR';

export default function ProductsList() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchProducts() {
			const supabase = createSupabaseBrowserClient();

			try {
				const { data, error } = await supabase.from('Products').select('*').order('created_at', { ascending: false }).limit(5);

				if (error) throw error;
				setProducts(data || []);
			} catch (error) {
				console.error('Error fetching products:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchProducts();
	}, []);

	if (loading) {
		return (
			<section className="bg-white border rounded-xl overflow-hidden">
				<div className="px-4 py-3 border-b flex items-center justify-between">
					<h3 className="font-semibold text-violet-900">Produk Terbaru</h3>
				</div>
				<div className="p-8 text-center text-gray-500">Memuat data...</div>
			</section>
		);
	}

	if (products.length === 0) {
		return (
			<section className="bg-white border rounded-xl overflow-hidden">
				<div className="px-4 py-3 border-b flex items-center justify-between">
					<h3 className="font-semibold text-violet-900">Produk Terbaru</h3>
				</div>
				<div className="p-8 text-center text-gray-500">Belum ada produk</div>
			</section>
		);
	}

	return (
		<section className="bg-white border rounded-xl overflow-hidden">
			<div className="px-4 py-3 border-b flex items-center justify-between">
				<h3 className="font-semibold text-violet-900">Produk Terbaru</h3>
			</div>

			<ul className="divide-y">
				{products.map((product) => (
					<li key={product.id} className="flex items-center justify-between px-4 py-3">
						<div>
							<div className="font-medium text-violet-900">{product.nama}</div>
							<div className="text-sm text-violet-600">{formatIDR(product.harga)}</div>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
