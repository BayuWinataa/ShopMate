// app/(admin)/admin/page.jsx
import Link from 'next/link';

export default function AdminDashboardPage() {
	return (
		<div className="space-y-6">
			{/* Heading + actions */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
					<p className="text-gray-500">Ringkasan performa toko hari ini</p>
				</div>
				<Link href="/admin/products/new" className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
					+ Produk Baru
				</Link>
			</div>

			{/* Stats cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<CardStat title="Penjualan (Hari ini)" value="Rp 2.350.000" sub="+12% dari kemarin" />
				<CardStat title="Pesanan Baru" value="18" sub="+3 open" />
				<CardStat title="Produk Aktif" value="128" sub="12 low stock" />
				<CardStat title="Pelanggan" value="1.204" sub="+21 minggu ini" />
			</div>

			{/* Tabel pesanan terbaru (dummy) */}
			<section className="bg-white border rounded-xl overflow-hidden">
				<div className="px-4 py-3 border-b flex items-center justify-between">
					<h3 className="font-semibold text-gray-900">Pesanan Terbaru</h3>
					<Link href="/admin/orders" className="text-sm text-indigo-600 hover:text-indigo-700">
						Lihat semua
					</Link>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead className="bg-gray-50 text-gray-600">
							<tr>
								<Th>ID Pesanan</Th>
								<Th>Tanggal</Th>
								<Th>Pelanggan</Th>
								<Th>Total</Th>
								<Th>Status</Th>
								<Th className="text-right pr-4">Aksi</Th>
							</tr>
						</thead>
						<tbody className="divide-y">
							{[
								{ id: '#INV-1023', date: '2025-10-18', name: 'Budi', total: 'Rp 350.000', status: 'Diproses' },
								{ id: '#INV-1022', date: '2025-10-18', name: 'Sari', total: 'Rp 120.000', status: 'Selesai' },
								{ id: '#INV-1021', date: '2025-10-17', name: 'Andi', total: 'Rp 980.000', status: 'Menunggu' },
							].map((o) => (
								<tr key={o.id} className="bg-white hover:bg-gray-50">
									<Td>{o.id}</Td>
									<Td>{o.date}</Td>
									<Td>{o.name}</Td>
									<Td>{o.total}</Td>
									<Td>
										<span className={`px-2 py-1 rounded text-xs ${o.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700' : o.status === 'Diproses' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'}`}>{o.status}</span>
									</Td>
									<Td className="text-right pr-4">
										<Link href={`/admin/orders/${encodeURIComponent(o.id)}`} className="text-indigo-600 hover:text-indigo-700">
											Detail
										</Link>
									</Td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* List produk singkat (dummy) */}
			<section className="bg-white border rounded-xl overflow-hidden">
				<div className="px-4 py-3 border-b flex items-center justify-between">
					<h3 className="font-semibold text-gray-900">Produk Terbaru</h3>
					<Link href="/admin/products" className="text-sm text-indigo-600 hover:text-indigo-700">
						Kelola Produk
					</Link>
				</div>

				<ul className="divide-y">
					{[
						{ name: 'Kaos Oversize Hitam', price: 'Rp 120.000', stock: 34 },
						{ name: 'Hoodie Fleece Abu', price: 'Rp 320.000', stock: 12 },
						{ name: 'Topi Baseball Navy', price: 'Rp 95.000', stock: 58 },
					].map((p) => (
						<li key={p.name} className="flex items-center justify-between px-4 py-3">
							<div>
								<div className="font-medium text-gray-900">{p.name}</div>
								<div className="text-sm text-gray-500">{p.price}</div>
							</div>
							<div className="flex items-center gap-4">
								<span className="text-sm text-gray-500">Stok: {p.stock}</span>
								<Link href="/admin/products" className="text-sm text-indigo-600 hover:text-indigo-700">
									Edit
								</Link>
							</div>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}

function CardStat({ title, value, sub }) {
	return (
		<div className="bg-white border rounded-xl p-4">
			<div className="text-sm text-gray-500">{title}</div>
			<div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
			<div className="text-xs text-gray-500 mt-2">{sub}</div>
		</div>
	);
}

function Th({ children, className = '' }) {
	return <th className={`px-4 py-3 text-left font-medium ${className}`}>{children}</th>;
}
function Td({ children, className = '' }) {
	return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
