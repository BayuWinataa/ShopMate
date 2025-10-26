'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { formatIDR } from '@/lib/formatIDR';

export default function StatsSection() {
	const [stats, setStats] = useState({
		totalProducts: 0,
		totalOrders: 0,
		totalRevenue: 0,
		pendingOrders: 0,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchStats() {
			const supabase = createSupabaseBrowserClient();

			try {
				// Get total products
				const { count: productsCount } = await supabase.from('Products').select('*', { count: 'exact', head: true });

				// Get total orders
				const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });

				// Get pending orders
				const { count: pendingCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending');

				// Get total revenue
				const { data: orders } = await supabase.from('orders').select('totalPrice');
				const revenue = orders?.reduce((sum, order) => sum + (order.totalPrice || 0), 0) || 0;

				setStats({
					totalProducts: productsCount || 0,
					totalOrders: ordersCount || 0,
					totalRevenue: revenue,
					pendingOrders: pendingCount || 0,
				});
			} catch (error) {
				console.error('Error fetching stats:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchStats();
	}, []);

	const statsData = [
		{ title: 'Total Penjualan', value: formatIDR(stats.totalRevenue), sub: `${stats.totalOrders} pesanan` },
		{ title: 'Pesanan Pending', value: stats.pendingOrders.toString(), sub: 'Menunggu diproses' },
		{ title: 'Produk Aktif', value: stats.totalProducts.toString(), sub: 'Total produk' },
		{ title: 'Total Pesanan', value: stats.totalOrders.toString(), sub: 'Semua pesanan' },
	];

	if (loading) {
		return (
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="bg-white border rounded-xl p-4 animate-pulse">
						<div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
						<div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
						<div className="h-3 bg-gray-200 rounded w-1/3"></div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{statsData.map((stat) => (
				<div key={stat.title} className="bg-white border rounded-xl p-4">
					<div className="text-sm text-violet-600">{stat.title}</div>
					<div className="text-2xl font-bold text-violet-900 mt-1">{stat.value}</div>
					<div className="text-xs text-violet-600 mt-2">{stat.sub}</div>
				</div>
			))}
		</div>
	);
}
