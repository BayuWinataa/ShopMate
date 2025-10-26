'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import ProductViewDialog from '@/components/admin/ProductViewDialog';
import ProductEditDialog from '@/components/admin/ProductEditDialog';
import ProductDeleteButton from '@/components/admin/ProductDeleteButton';
import ProductCreateDialog from '@/components/admin/ProductCreateDialog';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Search, X } from 'lucide-react';

const PAGE_SIZE = 10;

const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);

export default function AdminProductsPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [total, setTotal] = useState(0);
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	const page = Math.max(1, Number(searchParams.get('page') ?? 1));
	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

	// Debounce search query
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 1000); // 1 second delay

		return () => clearTimeout(timer);
	}, [searchQuery]);

	useEffect(() => {
		async function fetchProducts() {
			setLoading(true);
			const supabase = createSupabaseBrowserClient();

			try {
				let query = supabase.from('Products').select('*', { count: 'exact', head: false });

				// Add search filter if debouncedSearchQuery exists
				if (debouncedSearchQuery.trim()) {
					query = query.or(`nama.ilike.%${debouncedSearchQuery}%,kategori.ilike.%${debouncedSearchQuery}%,deskripsi.ilike.%${debouncedSearchQuery}%`);
				}

				query = query.order('created_at', { ascending: false }).range(from, to);

				const { data, error, count } = await query;

				if (error) throw error;

				setProducts(data || []);
				setTotal(count ?? 0);
			} catch (error) {
				console.error('Error fetching products:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchProducts();
	}, [debouncedSearchQuery, page, from, to, refreshTrigger]);

	const handleSearch = (query) => {
		setSearchQuery(query);
		const params = new URLSearchParams(searchParams);
		if (query.trim()) {
			params.set('search', query);
		} else {
			params.delete('search');
		}
		params.set('page', '1'); // Reset to first page when searching
		router.push(`?${params.toString()}`);
	};

	const clearSearch = () => {
		setSearchQuery('');
		setDebouncedSearchQuery('');
		const params = new URLSearchParams(searchParams);
		params.delete('search');
		params.set('page', '1');
		router.push(`?${params.toString()}`);
	};

	const createPageUrl = (pageNum) => {
		const params = new URLSearchParams(searchParams);
		params.set('page', pageNum.toString());
		return `?${params.toString()}`;
	};

	const handleProductCreated = () => {
		toast.success('Produk berhasil ditambahkan!');
		// Refresh data
		setRefreshTrigger((prev) => prev + 1);
	};

	const handleProductUpdated = () => {
		toast.success('Produk berhasil diperbarui!');
		// Refresh data
		setRefreshTrigger((prev) => prev + 1);
	};

	const handleProductDeleted = () => {
		toast.success('Produk berhasil dihapus!');
		// Refresh data
		setRefreshTrigger((prev) => prev + 1);
	};

	return (
		// >>> penting: min-w-0 supaya kolom grid ini mau mengecil dan tidak "dorong" sidebar
		<div className="space-y-6 min-w-0">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div className="space-y-1 min-w-0">
					<h2 className="text-2xl font-bold tracking-tight text-violet-900 truncate">Produk</h2>
					{debouncedSearchQuery && <p className="text-sm text-violet-600">Menampilkan hasil pencarian untuk "{debouncedSearchQuery}"</p>}
				</div>
				<div className="flex items-center gap-3 w-full sm:w-auto">
					<div className="relative flex-1 sm:flex-initial sm:w-64">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							type="text"
							placeholder="Cari produk..."
							value={searchQuery}
							onChange={(e) => handleSearch(e.target.value)}
							className="pl-10 pr-10 text-violet-900 placeholder:text-violet-400 focus-visible:border-violet-600 focus-visible:ring-violet-200 focus-visible:ring-1"
						/>
						{searchQuery && (
							<button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
								<X className="h-4 w-4" />
							</button>
						)}
					</div>
					<ProductCreateDialog onSuccess={handleProductCreated} />
				</div>
			</div>

			{/* >>> bungkus tabel dengan scroller, dan beri min-w pada tabel */}
			<div className="rounded-xl border border-violet-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
				<div className="overflow-x-auto">
					{/* min-w bikin tabel scroll horizontal di mobile, bukan melebarkan layout */}
					<Table className="w-full min-w-[800px]">
						<TableHeader>
							<TableRow className="bg-violet-50">
								<TableHead className="w-12 text-center text-violet-600">No</TableHead>
								<TableHead className="w-16 text-violet-600">Gambar</TableHead>
								<TableHead className="text-violet-600">Nama</TableHead>
								{/* Sembunyikan kategori di layar kecil biar hemat space */}
								<TableHead className="hidden sm:table-cell text-violet-600">Kategori</TableHead>
								<TableHead className="text-violet-600">Harga</TableHead>
								<TableHead className="hidden md:table-cell text-violet-600">Dibuat</TableHead>
								<TableHead className="text-center text-violet-600">Aksi</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{loading && (
								<>
									{Array.from({ length: PAGE_SIZE }).map((_, idx) => (
										<TableRow key={`skeleton-${idx}`}>
											<TableCell className="text-center">
												<Skeleton className="h-4 w-6 mx-auto" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-12 w-16 rounded-md" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-48" />
											</TableCell>
											<TableCell className="hidden sm:table-cell">
												<Skeleton className="h-4 w-20" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-24" />
											</TableCell>
											<TableCell className="hidden md:table-cell">
												<Skeleton className="h-4 w-20" />
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-center gap-2">
													<Skeleton className="h-8 w-16" />
													<Skeleton className="h-8 w-16" />
													<Skeleton className="h-8 w-16" />
												</div>
											</TableCell>
										</TableRow>
									))}
								</>
							)}

							{!loading && products.length === 0 && debouncedSearchQuery && (
								<TableRow>
									<TableCell colSpan={7} className="py-8 text-center text-violet-600">
										Tidak ada produk yang cocok dengan "{debouncedSearchQuery}".
									</TableCell>
								</TableRow>
							)}

							{!loading && products.length === 0 && !searchQuery && (
								<TableRow>
									<TableCell colSpan={7} className="py-8 text-center text-violet-600">
										Belum ada produk.
									</TableCell>
								</TableRow>
							)}

							{!loading &&
								products.map((p, idx) => {
									const img = p.gambar || p.image || '/Frame 1.svg';
									return (
										<TableRow key={p.id}>
											<TableCell className="text-center text-violet-600 whitespace-nowrap">{from + idx + 1}</TableCell>

											<TableCell className="whitespace-nowrap">
												<div className="h-12 w-16 overflow-hidden rounded-md border bg-muted">
													<Image src={img} alt={p.nama} width={64} height={48} className="h-12 w-16 object-cover" />
												</div>
											</TableCell>

											{/* min-w-0 + truncate supaya teks nama tidak melar */}
											<TableCell className="font-medium text-violet-900 min-w-0 max-w-[280px]">
												<span className="block truncate">{p.nama}</span>
											</TableCell>

											<TableCell className="hidden sm:table-cell capitalize text-violet-600 whitespace-nowrap">{p.kategori || '-'}</TableCell>

											<TableCell className="font-semibold text-violet-900 whitespace-nowrap">{formatIDR(p.harga)}</TableCell>

											<TableCell className="hidden md:table-cell text-violet-600 whitespace-nowrap">{p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID') : '-'}</TableCell>

											<TableCell className="text-right">
												<div className="flex items-center justify-center gap-2">
													<ProductViewDialog product={p} />
													<ProductEditDialog product={p} onSuccess={handleProductUpdated} />
													<ProductDeleteButton id={p.id} nama={p.nama} onSuccess={handleProductDeleted} />
												</div>
											</TableCell>
										</TableRow>
									);
								})}
						</TableBody>

						{typeof total === 'number' && (
							<TableCaption className="text-violet-600">
								Menampilkan {products?.length ?? 0} dari {total} produk.
							</TableCaption>
						)}
					</Table>
				</div>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious href={createPageUrl(Math.max(1, page - 1))} />
						</PaginationItem>

						{(() => {
							const items = [];
							const window = 1;
							const start = Math.max(1, page - window);
							const end = Math.min(totalPages, page + window);

							if (start > 1) {
								items.push(
									<PaginationItem key={1}>
										<PaginationLink href={createPageUrl(1)} isActive={page === 1}>
											1
										</PaginationLink>
									</PaginationItem>
								);
							}
							if (start > 2) {
								items.push(
									<PaginationItem key="ellipsis-start">
										<PaginationEllipsis />
									</PaginationItem>
								);
							}
							for (let i = start; i <= end; i++) {
								items.push(
									<PaginationItem key={i}>
										<PaginationLink href={createPageUrl(i)} isActive={page === i}>
											{i}
										</PaginationLink>
									</PaginationItem>
								);
							}
							if (end < totalPages - 1) {
								items.push(
									<PaginationItem key="ellipsis-end">
										<PaginationEllipsis />
									</PaginationItem>
								);
							}
							if (end < totalPages) {
								items.push(
									<PaginationItem key={totalPages}>
										<PaginationLink href={createPageUrl(totalPages)} isActive={page === totalPages}>
											{totalPages}
										</PaginationLink>
									</PaginationItem>
								);
							}
							return items;
						})()}

						<PaginationItem>
							<PaginationNext href={createPageUrl(Math.min(totalPages, page + 1))} />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}
