'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { formatIDR } from '@/lib/formatIDR';

export default function OrdersTable() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchOrders() {
			const supabase = createSupabaseBrowserClient();

			try {
				const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5);

				if (error) throw error;
				setOrders(data || []);
			} catch (error) {
				console.error('Error fetching orders:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchOrders();
	}, []);

	const getStatusLabel = (status) => {
		const statusMap = {
			pending: 'Menunggu',
			processing: 'Diproses',
			completed: 'Selesai',
			cancelled: 'Dibatalkan',
		};
		return statusMap[status] || status;
	};

	const getStatusClass = (status) => {
		const classMap = {
			pending: 'bg-amber-50 text-amber-700',
			processing: 'bg-indigo-50 text-indigo-700',
			completed: 'bg-emerald-50 text-emerald-700',
			cancelled: 'bg-red-50 text-red-700',
		};
		return classMap[status] || 'bg-gray-50 text-gray-700';
	};

	if (loading) {
		return (
			<section className="bg-white border rounded-xl overflow-hidden">
				<div className="px-4 py-3 border-b flex items-center justify-between">
					<h3 className="font-semibold text-violet-900">Pesanan Terbaru</h3>
				</div>
				<div className="p-8 text-center text-gray-500">Memuat data...</div>
			</section>
		);
	}

	if (orders.length === 0) {
		return (
			<section className="bg-white border rounded-xl overflow-hidden">
				<div className="px-4 py-3 border-b flex items-center justify-between">
					<h3 className="font-semibold text-violet-900">Pesanan Terbaru</h3>
				</div>
				<div className="p-8 text-center text-gray-500">Belum ada pesanan</div>
			</section>
		);
	}

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
							<Th>Nama</Th>
							<Th>Total</Th>
							<Th>Status</Th>
							<Th className="text-right pr-4">Aksi</Th>
						</tr>
					</thead>
					<tbody className="divide-y">
						{orders.map((order) => (
							<tr key={order.id} className="bg-white hover:bg-gray-50">
								<Td>#{order.id?.slice(0, 8)}</Td>
								<Td>{new Date(order.created_at).toLocaleDateString('id-ID')}</Td>
								<Td>{order.name || 'N/A'}</Td>
								<Td>{formatIDR(order.totalPrice || 0)}</Td>
								<Td>
									<span className={`px-2 py-1 rounded text-xs ${getStatusClass(order.status)}`}>{getStatusLabel(order.status)}</span>
								</Td>
								<Td className="text-right pr-4">
									<Link href={`/dashboard/orders`} className="text-indigo-600 hover:text-indigo-700">
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
