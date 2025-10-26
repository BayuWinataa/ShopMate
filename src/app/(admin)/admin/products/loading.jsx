import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

const PAGE_SIZE = 10;

export default function Loading() {
	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<Skeleton className="h-7 w-40" />
				<Skeleton className="h-4 w-72" />
			</div>

			<div className="rounded-xl border bg-card">
				<Table>
					<TableHeader>
						<TableRow className="bg-violet-50">
							<TableHead className="w-12 text-center text-violet-600">No</TableHead>
							<TableHead className="w-16 text-violet-600">Gambar</TableHead>
							<TableHead className="text-violet-600">Nama</TableHead>
							<TableHead className="text-violet-600">Kategori</TableHead>
							<TableHead className="text-violet-600">Harga</TableHead>
							<TableHead className="hidden md:table-cell text-violet-600">Dibuat</TableHead>
							<TableHead className="text-right text-violet-600">Aksi</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: PAGE_SIZE }).map((_, i) => (
							<TableRow key={i}>
								<TableCell className="text-center">
									<Skeleton className="mx-auto h-4 w-6" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-12 w-16 rounded-md" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-48" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-24" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-24" />
								</TableCell>
								<TableCell className="hidden md:table-cell">
									<Skeleton className="h-4 w-24" />
								</TableCell>
								<TableCell className="text-right">
									<Skeleton className="ml-auto h-8 w-16 rounded-md" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-center gap-2">
				<Skeleton className="h-9 w-20 rounded-md" />
				<Skeleton className="h-9 w-9 rounded-md" />
				<Skeleton className="h-9 w-9 rounded-md" />
				<Skeleton className="h-9 w-9 rounded-md" />
				<Skeleton className="h-9 w-20 rounded-md" />
			</div>
		</div>
	);
}
