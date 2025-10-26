import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h2 className="text-2xl font-bold tracking-tight">Cart Items</h2>
					<p className="text-sm text-violet-600">Daftar item keranjang pengguna.</p>
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
						{Array.from({ length: 10 }).map((_, i) => (
							<TableRow key={i}>
								<TableCell>
									<Skeleton className="h-4 w-48" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-48" />
								</TableCell>
								<TableCell className="text-right">
									<Skeleton className="h-4 w-12 ml-auto" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-40" />
								</TableCell>
								<TableCell className="text-center">
									<Skeleton className="h-8 w-16 inline-block" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-40" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
