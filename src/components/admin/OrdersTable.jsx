import Link from 'next/link';

export default function OrdersTable() {
	const orders = [
		{ id: '#INV-1023', date: '2025-10-18', name: 'Budi', total: 'Rp 350.000', status: 'Diproses' },
		{ id: '#INV-1022', date: '2025-10-18', name: 'Sari', total: 'Rp 120.000', status: 'Selesai' },
		{ id: '#INV-1021', date: '2025-10-17', name: 'Andi', total: 'Rp 980.000', status: 'Menunggu' },
	];

	return (
		<section className="bg-white border rounded-xl overflow-hidden">
			<div className="px-4 py-3 border-b flex items-center justify-between">
				<h3 className="font-semibold text-violet-900">Pesanan Terbaru</h3>
				<Link href="/admin/orders" className="text-sm text-violet-600 hover:text-violet-700">
					Lihat semua
				</Link>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full text-sm">
					<thead className="bg-violet-50 text-violet-600">
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
						{orders.map((o) => (
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
	);
}

function Th({ children, className = '' }) {
	return <th className={`px-4 py-3 text-left font-medium ${className}`}>{children}</th>;
}
function Td({ children, className = '' }) {
	return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
