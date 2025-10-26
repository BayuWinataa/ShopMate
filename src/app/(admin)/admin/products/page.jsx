import Link from 'next/link';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import ProductViewDialog from '@/components/admin/ProductViewDialog';
import ProductEditDialog from '@/components/admin/ProductEditDialog';
import ProductDeleteButton from '@/components/admin/ProductDeleteButton';
import ProductCreateDialog from '@/components/admin/ProductCreateDialog';
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
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h2 className="text-2xl font-bold tracking-tight text-violet-900">Produk</h2>
				</div>
				<ProductCreateDialog />
			</div>
			<div className="rounded-xl border border-violet-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
				<Table>
					<TableHeader>
						<TableRow className="bg-violet-50">
							<TableHead className="w-12 text-center text-violet-600">No</TableHead>
							<TableHead className="w-16 text-violet-600">Gambar</TableHead>
							<TableHead className="text-violet-600">Nama</TableHead>
							<TableHead className="text-violet-600">Kategori</TableHead>
							<TableHead className="text-violet-600">Harga</TableHead>
							<TableHead className="text-violet-600">Dibuat</TableHead>
							<TableHead className="text-center text-violet-600">Aksi</TableHead>
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
								<TableCell colSpan={7} className="py-8 text-center text-violet-600">
									Belum ada produk.
								</TableCell>
							</TableRow>
						)}
						{(products ?? []).map((p, idx) => {
							const img = p.gambar || p.image || '/Frame 1.svg';
							return (
								<TableRow key={p.id}>
									<TableCell className="text-center text-violet-600">{from + idx + 1}</TableCell>
									<TableCell>
										<div className="h-12 w-16 overflow-hidden rounded-md border bg-muted">
											{/* Use next/image when possible; fallback to img if needed */}
											<Image src={img} alt={p.nama} width={64} height={48} className="h-12 w-16 object-cover" />
										</div>
									</TableCell>
									<TableCell className="font-medium text-violet-900">{p.nama}</TableCell>
									<TableCell className="capitalize text-violet-600">{p.kategori || '-'}</TableCell>
									<TableCell className="font-semibold text-violet-900">{formatIDR(p.harga)}</TableCell>
									<TableCell className="hidden md:table-cell text-violet-600">{p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID') : '-'}</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-center gap-2">
											<ProductViewDialog product={p} />
											<ProductEditDialog product={p} />
											<ProductDeleteButton id={p.id} nama={p.nama} />
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
