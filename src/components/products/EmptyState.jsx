import { Package } from 'lucide-react';

export default function EmptyState() {
	return (
		<div className="text-center py-16">
			<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 mb-4 ring-4 ring-violet-50">
				<Package className="h-8 w-8 text-violet-600" />
			</div>
			<h3 className="text-lg font-semibold text-violet-900 mb-2">Produk tidak ditemukan</h3>
			<p className="text-violet-600/80">Coba ubah filter atau kata kunci pencarian Anda.</p>
		</div>
	);
}
