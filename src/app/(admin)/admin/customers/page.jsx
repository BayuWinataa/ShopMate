'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const PAGE_SIZE = 10;

function formatDate(idDate) {
	try {
		return new Date(idDate).toLocaleString('id-ID', {
			year: 'numeric',
			month: 'short',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		});
	} catch {
		return '-';
	}
}

export default function AdminCustomersPage() {
	const [customers, setCustomers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [total, setTotal] = useState(0);
	const router = useRouter();
	const searchParams = useSearchParams();

	const page = Math.max(1, Number(searchParams.get('page')) || 1);
	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

	const fetchCustomers = async () => {
		try {
			setLoading(true);
			setError(null);
			const supabase = createSupabaseBrowserClient();

			const { data, error, count } = await supabase.from('customers').select('*', { count: 'exact', head: false }).order('created_at', { ascending: false }).range(from, to);

			if (error) {
				console.error('Error fetching customers:', error);
				setError(error);
				return;
			}

			setCustomers(data || []);
			setTotal(count || 0);
		} catch (error) {
			console.error('Error:', error);
			setError(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCustomers();
	}, [page]);

	const handlePageChange = (newPage) => {
		router.push(`?page=${newPage}`);
	};

	return (
		// min-w-0 + overflow-x-hidden cegah layout melebar (sidebar aman)
		<div className="space-y-6 min-w-0 overflow-x-hidden">
			<div className="space-y-1">
				<h2 className="text-2xl font-bold text-violet-900">Pelanggan</h2>
				<p className="text-sm text-violet-600">Data pelanggan terbaru.</p>
			</div>

			<div className="rounded-xl border border-violet-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
				{/* Scroller lokal untuk tabel agar sidebar tidak bergeser */}
				<div className="overflow-x-auto overscroll-x-contain [scrollbar-gutter:stable] [contain:layout_paint]">
					{/* min-w: bila viewport sempit, tabel yang scroll (bukan layout melebar) */}
					<Table className="w-full min-w-[900px]">
						<TableHeader>
							<TableRow className="bg-violet-50">
								<TableHead className="w-12 text-center text-violet-600">No</TableHead>
								<TableHead className="text-violet-600">Nama</TableHead>
								<TableHead className="text-violet-600">No. HP</TableHead>
								<TableHead className="hidden sm:table-cell text-violet-600">Alamat</TableHead>
								<TableHead className="hidden md:table-cell text-violet-600">Catatan</TableHead>
								<TableHead className="text-violet-600">Dibuat</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{loading ? (
								// Skeleton loading rows
								Array.from({ length: PAGE_SIZE }).map((_, idx) => (
									<TableRow key={idx}>
										<TableCell className="text-center">
											<Skeleton className="h-4 w-6 mx-auto" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-32" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-24" />
										</TableCell>
										<TableCell className="hidden sm:table-cell">
											<Skeleton className="h-4 w-40" />
										</TableCell>
										<TableCell className="hidden md:table-cell">
											<Skeleton className="h-4 w-32" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-20" />
										</TableCell>
									</TableRow>
								))
							) : error ? (
								<TableRow>
									<TableCell colSpan={6} className="py-8 text-center text-red-600">
										Gagal memuat data pelanggan: {error.message}
									</TableCell>
								</TableRow>
							) : customers.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="py-8 text-center text-violet-600">
										Belum ada data pelanggan.
									</TableCell>
								</TableRow>
							) : (
								customers.map((c, idx) => (
									<TableRow key={c.id}>
										<TableCell className="text-center text-violet-600 whitespace-nowrap">{from + idx + 1}</TableCell>

										{/* min-w-0 + truncate agar teks panjang tidak dorong lebar */}
										<TableCell className="font-medium text-violet-900 min-w-0 max-w-[260px]">
											<span className="block truncate">{c.name || '-'}</span>
										</TableCell>

										<TableCell className="text-violet-700 whitespace-nowrap">{c.phone || '-'}</TableCell>

										<TableCell className="hidden sm:table-cell text-violet-700 min-w-0 max-w-[340px]">
											<span className="block truncate">{c.address || '-'}</span>
										</TableCell>

										<TableCell className="hidden md:table-cell text-violet-700 min-w-0 max-w-[280px]">
											<span className="block truncate">{c.note || '-'}</span>
										</TableCell>

										<TableCell className="text-violet-600 whitespace-nowrap">{c.created_at ? formatDate(c.created_at) : '-'}</TableCell>
									</TableRow>
								))
							)}
						</TableBody>

						{!loading && typeof total === 'number' && (
							<TableCaption className="text-violet-600">
								Menampilkan {customers.length} dari {total} pelanggan.
							</TableCaption>
						)}
					</Table>
				</div>
			</div>

			{/* Pagination */}
			{!loading && totalPages > 1 && (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious onClick={() => handlePageChange(Math.max(1, page - 1))} className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
						</PaginationItem>

						{(() => {
							const items = [];
							const window = 1; // tampilkan current +/-1
							const start = Math.max(1, page - window);
							const end = Math.min(totalPages, page + window);

							if (start > 1) {
								items.push(
									<PaginationItem key={1}>
										<PaginationLink onClick={() => handlePageChange(1)} isActive={page === 1} className="cursor-pointer">
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
										<PaginationLink onClick={() => handlePageChange(i)} isActive={page === i} className="cursor-pointer">
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
										<PaginationLink onClick={() => handlePageChange(totalPages)} isActive={page === totalPages} className="cursor-pointer">
											{totalPages}
										</PaginationLink>
									</PaginationItem>
								);
							}
							return items;
						})()}

						<PaginationItem>
							<PaginationNext onClick={() => handlePageChange(Math.min(totalPages, page + 1))} className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}
