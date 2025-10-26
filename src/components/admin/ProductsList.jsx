import Link from 'next/link';

export default function ProductsList() {
	const products = [
		{ name: 'Kaos Oversize Hitam', price: 'Rp 120.000', stock: 34 },
		{ name: 'Hoodie Fleece Abu', price: 'Rp 320.000', stock: 12 },
		{ name: 'Topi Baseball Navy', price: 'Rp 95.000', stock: 58 },
	];

	return (
		<section className="bg-white border rounded-xl overflow-hidden">
			<div className="px-4 py-3 border-b flex items-center justify-between">
				<h3 className="font-semibold text-violet-900">Produk Terbaru</h3>
				<Link href="/admin/products" className="text-sm text-violet-600 hover:text-violet-700">
					Kelola Produk
				</Link>
			</div>

			<ul className="divide-y">
				{products.map((p) => (
					<li key={p.name} className="flex items-center justify-between px-4 py-3">
						<div>
							<div className="font-medium text-violet-900">{p.name}</div>
							<div className="text-sm text-violet-600">{p.price}</div>
						</div>
						<div className="flex items-center gap-4">
							<span className="text-sm text-violet-600">Stok: {p.stock}</span>
							<Link href="/admin/products" className="text-sm text-violet-600 hover:text-violet-700">
								Edit
							</Link>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
