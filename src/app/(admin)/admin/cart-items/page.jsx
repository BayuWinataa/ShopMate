import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import CartItemViewDialog from '@/components/admin/CartItemViewDialog';

const PAGE_SIZE = 10;

export default async function AdminCartItemsPage({ searchParams }) {
	const page = Math.max(1, Number(searchParams?.page ?? 1));
	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	const supabase = await createSupabaseServerClient();

	const { data: items, error, count } = await supabase.from('cart_items').select('*', { count: 'exact', head: false }).order('created_at', { ascending: false }).range(from, to);

	const total = count ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h2 className="text-2xl font-bold tracking-tight">Cart Items</h2>
					<p className="text-sm text-muted-foreground">Daftar item keranjang pengguna.</p>
				</div>
			</div>

			<div className="rounded-xl border bg-card">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User ID</TableHead>
							<TableHead>Product ID</TableHead>
							<TableHead className="text-right">Quantity</TableHead>
							<TableHead>Dibuat</TableHead>
							<TableHead>Diperbarui</TableHead>
							<TableHead className="text-center">Aksi</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{error && (
							<TableRow>
								<TableCell colSpan={7} className="py-8 text-center text-rose-600">
									Gagal memuat data: {error.message}
								</TableCell>
							</TableRow>
						)}

						{!error && (items?.length ?? 0) === 0 && (
							<TableRow>
								<TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
									Belum ada data.
								</TableCell>
							</TableRow>
						)}

						{(items ?? []).map((it) => (
							<TableRow key={it.id}>
								<TableCell className="text-muted-foreground">{it.user_id}</TableCell>
								<TableCell className="text-muted-foreground">{it.product_id}</TableCell>
								<TableCell className="text-right">{it.quantity}</TableCell>
								<TableCell className="text-muted-foreground">{it.created_at ? new Date(it.created_at).toLocaleString('id-ID') : '-'}</TableCell>
								<TableCell className="text-muted-foreground">{it.updated_at ? new Date(it.updated_at).toLocaleString('id-ID') : '-'}</TableCell>
								<TableCell className="text-center">
									<CartItemViewDialog item={it} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
					{typeof total === 'number' && (
						<TableCaption>
							Menampilkan {items?.length ?? 0} dari {total} item.
						</TableCaption>
					)}
				</Table>
			</div>

			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious href={`?page=${Math.max(1, page - 1)}`} />
					</PaginationItem>

					{(() => {
						const items = [];
						const window = 1;
						const start = Math.max(1, page - window);
						const end = Math.min(totalPages, page + window);

						if (start > 1) {
							items.push(
								<PaginationItem key={1}>
									<PaginationLink href={`?page=1`} isActive={page === 1}>
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
									<PaginationLink href={`?page=${i}`} isActive={page === i}>
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
