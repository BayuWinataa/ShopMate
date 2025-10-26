'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, CreditCard, ShoppingCart, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

/* ========== UTIL ========== */
const toNum = (v) => {
	const n = Number(v);
	return Number.isFinite(n) ? n : 0;
};
const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);

const by = (obj, key, inc = 0) => ((obj[key] = (obj[key] ?? 0) + inc), obj);

/* ========== KOMPONEN ========== */
export default function StatsSection() {
	const [orders, setOrders] = useState([]);
	const [orderItems, setOrderItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [errMsg, setErrMsg] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			const supabase = createSupabaseBrowserClient();
			try {
				setErrMsg('');
				const [ordersRes, itemsRes] = await Promise.all([supabase.from('orders').select('id,total,created_at,payment_method,status').eq('status', 'CONFIRMED'), supabase.from('order_items').select('order_id,name,qty,subtotal')]);

				if (ordersRes.error) throw ordersRes.error;
				if (itemsRes.error) throw itemsRes.error;

				// Normalisasi angka jadi number
				const normOrders = (ordersRes.data || []).map((o) => ({
					...o,
					total: toNum(o.total),
					created_at: o.created_at || '',
					payment_method: o.payment_method || 'UNKNOWN',
				}));

				const normItems = (itemsRes.data || []).map((it) => ({
					...it,
					qty: toNum(it.qty),
					subtotal: toNum(it.subtotal),
				}));

				setOrders(normOrders);
				setOrderItems(normItems);
			} catch (error) {
				console.error('Error fetching data:', error);
				setErrMsg(error?.message || 'Gagal mengambil data.');
				setOrders([]);
				setOrderItems([]);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const stats = useMemo(() => {
		if (loading) {
			return {
				totalRevenue: 0,
				totalOrders: 0,
				avgOrder: 0,
				countByPay: {},
				revByPay: {},
				trend: [],
				topQty: [],
				topRev: [],
			};
		}

		const confirmed = orders;

		const totalRevenue = confirmed.reduce((s, o) => s + toNum(o.total), 0);
		const totalOrders = confirmed.length;
		const avgOrder = totalOrders ? totalRevenue / totalOrders : 0;

		// payment method (count & revenue)
		const countByPay = {};
		const revByPay = {};
		confirmed.forEach((o) => {
			const pm = o.payment_method || 'UNKNOWN';
			by(countByPay, pm, 1);
			by(revByPay, pm, toNum(o.total));
		});

		// revenue per day (YYYY-MM-DD)
		const revByDay = {};
		confirmed.forEach((o) => {
			const day = (o.created_at || '').slice(0, 10) || 'N/A';
			by(revByDay, day, toNum(o.total));
		});
		const trend = Object.entries(revByDay)
			.filter(([d]) => d !== 'N/A')
			.sort(([a], [b]) => (a > b ? 1 : -1))
			.map(([date, value]) => ({ date, value: toNum(value) }));

		// top products (hanya items yang order_id-nya valid)
		const validOrderIds = new Set(confirmed.map((o) => o.id));
		const qtyByProduct = {};
		const revByProduct = {};
		orderItems.forEach((it) => {
			if (!validOrderIds.has(it.order_id)) return;
			by(qtyByProduct, it.name, toNum(it.qty));
			by(revByProduct, it.name, toNum(it.subtotal));
		});
		const topQty = Object.entries(qtyByProduct)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([name, qty]) => ({ name, qty: toNum(qty) }));
		const topRev = Object.entries(revByProduct)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([name, revenue]) => ({ name, revenue: toNum(revenue) }));

		return { totalRevenue, totalOrders, avgOrder, countByPay, revByPay, trend, topQty, topRev };
	}, [orders, orderItems, loading]);

	const payData = useMemo(() => {
		const keys = Object.keys(stats.countByPay || {});
		return keys.map((k) => ({
			method: (k || 'UNKNOWN').toUpperCase(),
			orders: stats.countByPay[k] || 0,
			revenue: stats.revByPay[k] || 0,
		}));
	}, [stats]);

	if (loading) {
		return (
			<section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
				{/* Header Skeleton */}
				<div className="mb-6">
					<Skeleton className="h-8 w-64 mb-2" />
					<Skeleton className="h-4 w-80" />
				</div>

				{/* Stat cards skeleton */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
					<Card className="overflow-hidden">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm text-slate-600 flex items-center gap-2">
								<Skeleton className="h-8 w-8 rounded-lg" />
								<Skeleton className="h-4 w-24" />
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<Skeleton className="h-8 w-32" />
						</CardContent>
					</Card>
					<Card className="overflow-hidden">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm text-slate-600 flex items-center gap-2">
								<Skeleton className="h-8 w-8 rounded-lg" />
								<Skeleton className="h-4 w-20" />
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<Skeleton className="h-8 w-16" />
						</CardContent>
					</Card>
					<Card className="overflow-hidden">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm text-slate-600 flex items-center gap-2">
								<Skeleton className="h-8 w-8 rounded-lg" />
								<Skeleton className="h-4 w-28" />
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<Skeleton className="h-8 w-32" />
						</CardContent>
					</Card>
				</div>

				{/* Charts row skeleton */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
					<Card className="lg:col-span-2">
						<CardHeader>
							<Skeleton className="h-5 w-40" />
						</CardHeader>
						<CardContent className="h-64">
							<Skeleton className="h-full w-full" />
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<Skeleton className="h-5 w-32" />
						</CardHeader>
						<CardContent className="h-64">
							<Skeleton className="h-full w-full" />
						</CardContent>
					</Card>
				</div>

				{/* Tables row skeleton */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
					<Card>
						<CardHeader>
							<Skeleton className="h-5 w-36" />
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{Array.from({ length: 5 }).map((_, i) => (
									<div key={i} className="flex items-center justify-between py-2">
										<div className="flex items-center gap-2">
											<Skeleton className="h-6 w-6 rounded-full" />
											<Skeleton className="h-4 w-48" />
										</div>
										<Skeleton className="h-4 w-12" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<Skeleton className="h-5 w-40" />
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{Array.from({ length: 5 }).map((_, i) => (
									<div key={i} className="flex items-center justify-between py-2">
										<div className="flex items-center gap-2">
											<Skeleton className="h-6 w-6 rounded-full" />
											<Skeleton className="h-4 w-48" />
										</div>
										<Skeleton className="h-4 w-16" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</section>
		);
	}

	return (
		<section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
			{/* Header */}
			<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
				<h2 className="text-2xl md:text-3xl font-bold tracking-tight">Ringkasan Penjualan</h2>
				{errMsg && <p className="mt-2 text-sm text-red-600">⚠️ {errMsg}</p>}
			</motion.div>

			{/* Stat cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
				<StatCard title="Total Revenue" value={formatIDR(stats.totalRevenue)} icon={<ArrowUpRight className="h-5 w-5" aria-hidden />} accent="from-violet-500 to-indigo-500" />
				<StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingCart className="h-5 w-5" aria-hidden />} accent="from-fuchsia-500 to-pink-500" />
				<StatCard title="Avg. Order Value" value={formatIDR(Math.round(stats.avgOrder))} icon={<CreditCard className="h-5 w-5" aria-hidden />} accent="from-emerald-500 to-teal-500" />
			</div>

			{/* Charts row */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle className="text-base">Revenue Trend per Tanggal</CardTitle>
					</CardHeader>
					<CardContent className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={stats.trend}>
								<defs>
									<linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
										<stop offset="95%" stopColor="#7c3aed" stopOpacity={0.05} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
								<XAxis dataKey="date" stroke="#64748b" fontSize={12} />
								<YAxis tickFormatter={(v) => (v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}jt` : v)} stroke="#64748b" fontSize={12} />
								<Tooltip formatter={(v) => formatIDR(v)} labelFormatter={(l) => `Tanggal: ${l}`} />
								<Area type="monotone" dataKey="value" stroke="#7c3aed" fill="url(#revFill)" strokeWidth={2} />
							</AreaChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Payment Method</CardTitle>
					</CardHeader>
					<CardContent className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={payData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
								<XAxis dataKey="method" stroke="#64748b" fontSize={12} />
								<YAxis yAxisId="left" orientation="left" stroke="#7c3aed" fontSize={12} />
								<YAxis yAxisId="right" orientation="right" stroke="#059669" fontSize={12} />
								<Tooltip formatter={(v, n) => (n === 'orders' ? v : formatIDR(v))} />
								<Bar yAxisId="left" dataKey="orders" name="Orders" fill="#7c3aed" radius={[6, 6, 0, 0]} />
								<Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Tables row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Top Products — by Qty</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="divide-y divide-slate-200">
							{(stats.topQty || []).map((p, i) => (
								<li key={`${p.name}-${i}`} className="flex items-center justify-between py-2">
									<div className="flex items-center gap-2">
										<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-50 text-violet-700 text-xs font-medium">{i + 1}</span>
										<span className="font-medium text-slate-800">{p.name}</span>
									</div>
									<span className="text-sm text-slate-600">{p.qty} pcs</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Top Products — by Revenue</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="divide-y divide-slate-200">
							{(stats.topRev || []).map((p, i) => (
								<li key={`${p.name}-${i}`} className="flex items-center justify-between py-2">
									<div className="flex items-center gap-2">
										<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">{i + 1}</span>
										<span className="font-medium text-slate-800">{p.name}</span>
									</div>
									<span className="text-sm text-slate-700">{formatIDR(p.revenue)}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}

/* ============ kecil-kecil ============ */
function StatCard({ title, value, icon, accent = 'from-violet-500 to-indigo-500' }) {
	return (
		<motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
			<Card className="overflow-hidden">
				<CardHeader className="pb-2">
					<CardTitle className="text-sm text-slate-600 flex items-center gap-2">
						<span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${accent} text-white`}>{icon ?? <Wallet className="h-4 w-4" />}</span>
						{title}
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="text-2xl font-extrabold tracking-tight text-slate-900">{value}</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
