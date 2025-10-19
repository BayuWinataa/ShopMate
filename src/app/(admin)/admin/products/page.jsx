import Link from 'next/link';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import ProductViewDialog from '@/components/admin/ProductViewDialog';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const PAGE_SIZE = 10;

const formatIDR = (n) =>
	new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0,
	}).format(Number.isFinite(n) ? n : 0);

export default async function AdminProductsPage({ searchParams }) {
	const page = Math.max(1, Number(searchParams?.page ?? 1));
	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	const supabase = await createSupabaseServerClient();

	const { data: products, error, count } = await supabase.from('Products').select('*', { count: 'exact', head: false }).order('created_at', { ascending: false }).range(from, to);

	const total = count ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<h2 className="text-2xl font-bold tracking-tight">Produk</h2>
			</div>
			<div className="rounded-xl border bg-card">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-12 text-center">No</TableHead>
							<TableHead className="w-16">Gambar</TableHead>
							<TableHead>Nama</TableHead>
							<TableHead>Kategori</TableHead>
							<TableHead>Harga</TableHead>
							<TableHead className="hidden md:table-cell">Dibuat</TableHead>
							<TableHead className="text-right">Aksi</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{error && (
							<TableRow>
								<TableCell colSpan={7} className="py-8 text-center text-red-600">
									Gagal memuat produk: {error.message}
								</TableCell>
							</TableRow>
						)}
						{!error && (products?.length ?? 0) === 0 && (
							<TableRow>
								<TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
									Belum ada produk.
								</TableCell>
							</TableRow>
						)}
						{(products ?? []).map((p, idx) => {
							const img = p.gambar || p.image || '/Frame 1.svg';
							return (
								<TableRow key={p.id}>
									<TableCell className="text-center text-muted-foreground">{from + idx + 1}</TableCell>
									<TableCell>
										<div className="h-12 w-16 overflow-hidden rounded-md border bg-muted">
											{/* Use next/image when possible; fallback to img if needed */}
											<Image src={img} alt={p.nama} width={64} height={48} className="h-12 w-16 object-cover" />
										</div>
									</TableCell>
									<TableCell className="font-medium">{p.nama}</TableCell>
									<TableCell className="capitalize text-muted-foreground">{p.kategori || '-'}</TableCell>
									<TableCell className="font-semibold">{formatIDR(p.harga)}</TableCell>
									<TableCell className="hidden md:table-cell text-muted-foreground">{p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID') : '-'}</TableCell>
									<TableCell className="text-right">
										<ProductViewDialog product={p} />
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
					{typeof total === 'number' && (
						<TableCaption>
							Menampilkan {products?.length ?? 0} dari {total} produk.
						</TableCaption>
					)}
				</Table>
			</div>

			{/* Pagination */}
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious href={`?page=${Math.max(1, page - 1)}`} />
					</PaginationItem>

					{/* Page numbers with simple window */}
					{(() => {
						const items = [];
						const window = 1; // show current +/-1
						const start = Math.max(1, page - window);
						const end = Math.min(totalPages, page + window);

						// First page
						if (start > 1) {
							items.push(
								<PaginationItem key={1}>
									<PaginationLink href={`?page=1`} isActive={page === 1}>
										1
									</PaginationLink>
								</PaginationItem>
							);
						}
						// Ellipsis before
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
									<PaginationLink href={`?page=${i}`} isActive={page === i}>
										{i}
									</PaginationLink>
								</PaginationItem>
							);
						}

						// Ellipsis after
						if (end < totalPages - 1) {
							items.push(
								<PaginationItem key="ellipsis-end">
									<PaginationEllipsis />
								</PaginationItem>
							);
						}
						// Last page
						if (end < totalPages) {
							items.push(
								<PaginationItem key={totalPages}>
									<PaginationLink href={`?page=${totalPages}`} isActive={page === totalPages}>
										{totalPages}
									</PaginationLink>
								</PaginationItem>
							);
						}

						return items;
					})()}

					<PaginationItem>
						<PaginationNext href={`?page=${Math.min(totalPages, page + 1)}`} />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
