'use client';

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
			CONFIRMED: 'Dikonfirmasi',
			PENDING: 'Menunggu',
			PROCESSING: 'Diproses',
			COMPLETED: 'Selesai',
			CANCELLED: 'Dibatalkan',
		};
		return statusMap[status] || status;
	};

	const getStatusClass = (status) => {
		const classMap = {
			CONFIRMED: 'bg-emerald-50 text-emerald-700',
			PENDING: 'bg-amber-50 text-amber-700',
			PROCESSING: 'bg-indigo-50 text-indigo-700',
			COMPLETED: 'bg-emerald-50 text-emerald-700',
			CANCELLED: 'bg-red-50 text-red-700',
		};
		return classMap[status] || 'bg-gray-50 text-gray-700';
	};

	if (loading) {
		return (
			<section className="bg-white border rounded-xl overflow-hidden">
				<div className="px-4 py-3 border-b">
					<h3 className="font-semibold text-violet-900">Pesanan Terbaru</h3>
				</div>
				<div className="p-8 text-center text-gray-500">Memuat data...</div>
			</section>
		);
	}

	if (orders.length === 0) {
		return (
			<section className="bg-white border rounded-xl overflow-hidden">
				<div className="px-4 py-3 border-b">
					<h3 className="font-semibold text-violet-900">Pesanan Terbaru</h3>
				</div>
				<div className="p-8 text-center text-gray-500">Belum ada pesanan</div>
			</section>
		);
	}

	return (
		<section className="bg-white border rounded-xl overflow-hidden">
			<div className="px-4 py-3 border-b">
				<h3 className="font-semibold text-violet-900">Pesanan Terbaru</h3>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full text-sm">
					<thead className="bg-violet-50 text-violet-600">
						<tr>
							<Th className="whitespace-nowrap">Kode Pesanan</Th>
							<Th className="whitespace-nowrap">Tanggal</Th>
							<Th className="whitespace-nowrap">Total</Th>
							<Th className="whitespace-nowrap">Status</Th>
						</tr>
					</thead>
					<tbody className="divide-y">
						{orders.map((order) => (
							<tr key={order.id} className="bg-white hover:bg-gray-50">
								<Td className="whitespace-nowrap">#{order.order_code}</Td>
								<Td className="whitespace-nowrap">{new Date(order.created_at).toLocaleDateString('id-ID')}</Td>
								<Td className="whitespace-nowrap">{formatIDR(order.total || 0)}</Td>
								<Td className="whitespace-nowrap">
									<span className={`px-2 py-1 rounded text-xs ${getStatusClass(order.status)}`}>{getStatusLabel(order.status)}</span>
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
