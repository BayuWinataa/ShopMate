export default function StatsSection() {
	const stats = [
		{ title: 'Penjualan (Hari ini)', value: 'Rp 2.350.000', sub: '+12% dari kemarin' },
		{ title: 'Pesanan Baru', value: '18', sub: '+3 open' },
		{ title: 'Produk Aktif', value: '128', sub: '12 low stock' },
		{ title: 'Pelanggan', value: '1.204', sub: '+21 minggu ini' },
	];

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat) => (
				<div key={stat.title} className="bg-white border rounded-xl p-4">
					<div className="text-sm text-violet-600">{stat.title}</div>
					<div className="text-2xl font-bold text-violet-900 mt-1">{stat.value}</div>
					<div className="text-xs text-violet-600 mt-2">{stat.sub}</div>
				</div>
			))}
		</div>
	);
}
