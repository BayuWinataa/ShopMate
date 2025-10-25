'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ChevronDown } from 'lucide-react';
import ProductHero from '@/components/products/ProductHero';
import ProductToolbar from '@/components/products/ProductToolbar';
import ProductToolbarMobile from '@/components/products/ProductToolbarMobile';
import ProductGrid from '@/components/products/ProductGrid';
import EmptyState from '@/components/products/EmptyState';
import ProductCardSkeleton from '@/components/products/ProductCardSkeleton';
import { Button } from '@/components/ui/button';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const ITEMS_PER_PAGE = 12;

export default function Products() {
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('all');
	const [sortBy, setSortBy] = useState('name-asc');
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const { data, error } = await supabase.from('Products').select('*');
				if (error) throw error;
				setProducts(data || []);
			} catch (err) {
				console.error('Error fetching products:', err);
				setProducts([]);
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, []);

	const categories = useMemo(() => {
		const set = new Set(products.map((p) => p.kategori).filter(Boolean));
		return Array.from(set);
	}, [products]);

	const filteredProducts = useMemo(() => {
		let filtered = products.filter((p) => {
			const matchSearch = search ? (p.nama || '').toLowerCase().includes(search.toLowerCase()) : true;
			const matchCategory = category === 'all' ? true : p.kategori === category;
			return matchSearch && matchCategory;
		});

		// Sort
		if (sortBy === 'name-asc') filtered.sort((a, b) => (a.nama || '').localeCompare(b.nama || ''));
		if (sortBy === 'name-desc') filtered.sort((a, b) => (b.nama || '').localeCompare(a.nama || ''));
		if (sortBy === 'price-asc') filtered.sort((a, b) => (a.harga || 0) - (b.harga || 0));
		if (sortBy === 'price-desc') filtered.sort((a, b) => (b.harga || 0) - (a.harga || 0));

		return filtered;
	}, [products, search, category, sortBy]);

	// Reset display count when filters change
	useEffect(() => {
		setDisplayCount(ITEMS_PER_PAGE);
	}, [search, category, sortBy]);

	const displayedProducts = useMemo(() => {
		return filteredProducts.slice(0, displayCount);
	}, [filteredProducts, displayCount]);

	const hasMore = displayCount < filteredProducts.length;

	const handleLoadMore = () => {
		setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
			<ProductHero />

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<ProductToolbar search={search} setSearch={setSearch} category={category} setCategory={setCategory} sortBy={sortBy} setSortBy={setSortBy} categories={categories} />

				<ProductToolbarMobile search={search} setSearch={setSearch} category={category} setCategory={setCategory} sortBy={sortBy} setSortBy={setSortBy} categories={categories} />

				{loading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{Array.from({ length: 8 }).map((_, idx) => (
							<ProductCardSkeleton key={idx} />
						))}
					</div>
				) : filteredProducts.length === 0 ? (
					<EmptyState />
				) : (
					<>
						<ProductGrid products={displayedProducts} />

						{hasMore && (
							<div className="flex justify-center mt-12">
								<Button onClick={handleLoadMore} variant="pressPurple" size="lg" className="group gap-2 font-semibold">
									Muat Lebih Banyak
									<ChevronDown className="h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
								</Button>
							</div>
						)}

						{!hasMore && filteredProducts.length > ITEMS_PER_PAGE && (
							<div className="text-center mt-12">
								<p className="text-violet-600/80 text-md">Telah Menampilkan semua produk</p>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
