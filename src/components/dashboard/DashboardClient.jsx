'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Loader2, Send } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

// ✅ shadcn chart wrapper + recharts
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const formatIDR = (n) =>
	new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0,
	}).format(Number.isFinite(n) ? n : 0);

function timeAgo(ts) {
	if (!ts) return '—';
	const diff = Date.now() - new Date(ts).getTime();
	const m = Math.floor(diff / 60000);
	if (m < 1) return 'just now';
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	const d = Math.floor(h / 24);
	return `${d}d ago`;
}

export default function DashboardClient() {
	const [orders, setOrders] = useState([]);
	const [messagesGlobal, setMessagesGlobal] = useState([]);
	const [lastChatAt, setLastChatAt] = useState(null);
	const [ordersLoading, setOrdersLoading] = useState(true);
	const [ordersError, setOrdersError] = useState('');

	const supabase = createSupabaseBrowserClient();

	// Load dashboard orders from Supabase (not from localStorage)
	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setOrdersLoading(true);
				setOrdersError('');
				const { data, error } = await supabase
					.from('orders')
					.select(
						`id, order_code, payment_method, status, subtotal, total, created_at,
						customers:customer_id ( id, name, phone, address, note ),
						order_items ( id, product_id, name, price, qty, subtotal )`
					)
					.order('created_at', { ascending: false });

				if (error) {
					console.error('Error fetching dashboard orders:', error);
					setOrders([]);
					setOrdersError('Gagal memuat orders.');
					return;
				}

				const shaped = (data || []).map((o) => ({
					id: o.order_code || o.id,
					createdAt: o.created_at,
					status: o.status,
					payment: o.payment_method,
					subtotal: Number(o.subtotal || 0),
					total: Number(o.total || 0),
					customer: {
						name: o.customers?.name || '',
						phone: o.customers?.phone || '',
						address: o.customers?.address || '',
						note: o.customers?.note || '',
					},
					items: (o.order_items || []).map((it) => ({
						id: it.product_id,
						name: it.name,
						price: Number(it.price || 0),
						quantity: Number(it.qty || 1),
						subtotal: Number(it.subtotal || 0),
					})),
				}));

				setOrders(shaped);
			} catch (err) {
				console.error('Network error fetching dashboard orders:', err);
				setOrdersError('Gagal memuat orders.');
				setOrders([]);
			} finally {
				setOrdersLoading(false);
			}
		};

		fetchOrders();
	}, [supabase]);

	// Load other local-only info
	useEffect(() => {
		try {
			setMessagesGlobal(JSON.parse(localStorage.getItem('chat_messages') || '[]') || []);
		} catch {}
		try {
			setLastChatAt(localStorage.getItem('last_chat_at') || null);
		} catch {}
	}, []);

	const stats = useMemo(() => {
		const totalOrders = orders.length;
		const spent = orders.reduce((s, o) => s + (o.total || 0), 0);
		const invoices = orders.length;
		const unpaid = orders.filter((o) => (o.status || '').toUpperCase() !== 'PAID').length;
		return { totalOrders, spent, invoices, unpaid, lastChat: lastChatAt || null };
	}, [orders, lastChatAt]);

	const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);
	const recentChats = useMemo(() => {
		const users = messagesGlobal
			.filter((m) => m?.role === 'user')
			.slice(-3)
			.reverse();
		return users;
	}, [messagesGlobal]);

	// === AI modal ===
	const [isAskOpen, setIsAskOpen] = useState(false);
	const [askInput, setAskInput] = useState('');
	const [askMessages, setAskMessages] = useState([]);
	const [isAsking, setIsAsking] = useState(false);
	const askEndRef = useRef(null);

	useEffect(() => {
		try {
			setAskMessages(JSON.parse(localStorage.getItem('dash_ai_messages') || '[]') || []);
		} catch {}
	}, []);

	useEffect(() => {
		localStorage.setItem('dash_ai_messages', JSON.stringify(askMessages));
	}, [askMessages]);

	useEffect(() => {
		askEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [askMessages, isAsking, isAskOpen]);

	const contextString = useMemo(() => {
		if (!orders.length) return 'Order history: (empty).';
		const slice = orders.slice(0, 5).map((o) => ({
			id: o.id,
			createdAt: o.createdAt,
			total: o.total,
			status: o.status,
			items: (o.items || []).map((it) => ({
				name: it.nama,
				qty: it.qty,
				price: it.harga,
			})),
		}));
		return `Recent orders (latest first, max 5):\n${JSON.stringify(slice, null, 2)}`;
	}, [orders]);

	async function handleAskSubmit(e) {
		e.preventDefault();
		const text = askInput.trim();
		if (!text) return;

		const userMsg = { role: 'user', content: text };
		const next = [...askMessages, userMsg];
		setAskMessages(next);
		setAskInput('');
		setIsAsking(true);

		try {
			const res = await fetch('/api/dash-ai', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: next, context: contextString }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'AI request failed');
			setAskMessages((p) => [...p, { role: 'assistant', content: data.reply }]);
			localStorage.setItem('last_chat_at', new Date().toISOString());
		} catch (err) {
			setAskMessages((p) => [...p, { role: 'assistant', content: `Error: ${err.message}` }]);
		} finally {
			setIsAsking(false);
		}
	}

	// ===== Chart helpers =====
	const formatShort = (n) => {
		if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
		if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
		if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
		return String(n ?? 0);
	};

	const chartData = useMemo(() => {
		const byDate = new Map();
		for (const o of orders) {
			if (!o?.createdAt) continue;
			const d = new Date(o.createdAt);
			const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10);
			byDate.set(key, (byDate.get(key) ?? 0) + (o.total || 0));
		}
		const days = [];
		const today = new Date();
		for (let i = 6; i >= 0; i--) {
			const dt = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
			const key = dt.toISOString().slice(0, 10);
			days.push({
				date: key.slice(5),
				spent: byDate.get(key) ?? 0,
				full: key,
			});
		}
		return days;
	}, [orders]);

	return (
		<>
			{/* Stats */}
			<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<Card className="border-violet-100 shadow-sm hover:shadow-md transition-shadow">
					<CardContent className="p-4">
						<div className="text-sm text-violet-600 font-medium">Total Orders</div>
						<div className="mt-1 text-2xl font-bold text-violet-900">{ordersLoading ? '…' : stats.totalOrders}</div>
						<div className="text-xs text-gray-500">All stored orders</div>
					</CardContent>
				</Card>

				<Card className="border-violet-100 shadow-sm hover:shadow-md transition-shadow">
					<CardContent className="p-4">
						<div className="text-sm text-violet-600 font-medium">Spent</div>
						<div className="mt-1 text-2xl font-bold text-violet-900">{ordersLoading ? '…' : formatIDR(stats.spent)}</div>
						<div className="text-xs text-gray-500">Subtotal of all orders</div>
					</CardContent>
				</Card>
			</div>

			{/* Line Chart */}
			<div className="mt-4">
				<Card className="border-violet-100 shadow-sm">
					<CardContent className="p-4">
						<div className="mb-3">
							<div className="text-sm text-violet-700 font-semibold">Spent (Last 7 Days)</div>
							<div className="text-xs text-gray-600">Total value of orders per day</div>
						</div>

						<ChartContainer
							config={{
								spent: {
									label: 'Spent',
									color: 'hsl(var(--chart-1))',
								},
							}}
							className="h-64 w-full"
						>
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={chartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
									<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9d5ff" />
									<XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} stroke="#9333ea" />
									<YAxis tickLine={false} axisLine={false} width={40} tickFormatter={formatShort} fontSize={12} stroke="#9333ea" />
									<ChartTooltip content={<ChartTooltipContent formatter={(value) => formatIDR(value)} labelFormatter={(label, payload) => payload?.[0]?.payload?.full ?? label} />} />
									<Line type="monotone" dataKey="spent" stroke="#9333ea" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#7c3aed' }} />
								</LineChart>
							</ResponsiveContainer>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>

			{/* Recent section */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
				<Card className="border-violet-100 shadow-sm">
					<CardContent className="p-4">
						<div className="mb-3 flex items-center justify-between">
							<div className="text-sm font-semibold text-violet-900">Recent Orders</div>
							<Link href="/dashboard/orders" className="text-xs text-violet-600 hover:text-violet-700 font-medium">
								View All →
							</Link>
						</div>
						{recentOrders.length === 0 ? (
							<div className="text-sm text-gray-500">No orders yet.</div>
						) : (
							<ul className="space-y-2 text-sm">
								{recentOrders.map((o) => (
									<li key={o.id} className="flex items-center justify-between rounded-lg border border-violet-100 px-3 py-2 hover:bg-violet-50/30 transition-colors">
										<span className="truncate text-gray-700">
											<span className="font-medium text-violet-700">{o.id}</span> • {o.items?.[0]?.name ?? 'Order'}
											{o.items && o.items.length > 1 ? ` +${o.items.length - 1} item` : ''}
										</span>
										<span className="text-violet-900 font-semibold">{formatIDR(o.total || 0)}</span>
									</li>
								))}
							</ul>
						)}
					</CardContent>
				</Card>

				<Card className="border-violet-100 shadow-sm">
					<CardContent className="p-4">
						<div className="mb-3 flex items-center justify-between">
							<div className="text-sm font-semibold text-violet-900">Recent Chats</div>
							<Link href="/chat" className="text-xs text-violet-600 hover:text-violet-700 font-medium">
								Open Chat →
							</Link>
						</div>
						{recentChats.length === 0 ? (
							<div className="text-sm text-gray-500">No chats yet.</div>
						) : (
							<ul className="space-y-2 text-sm">
								{recentChats.map((m, i) => (
									<li key={i} className="rounded-lg border border-violet-100 px-3 py-2 hover:bg-violet-50/30 transition-colors">
										<span className="text-gray-700">
											"{m.content?.slice(0, 80) ?? ''}"{m.content && m.content.length > 80 ? '…' : ''}
										</span>{' '}
										<span className="text-gray-500">— {timeAgo(stats.lastChat)}</span>
									</li>
								))}
							</ul>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Modal Tanya AI */}
			<Dialog open={isAskOpen} onOpenChange={setIsAskOpen} modal={false}>
				<DialogContent className="flex h-[85vh] max-w-4xl flex-col gap-3 overflow-hidden p-0 border-violet-200">
					<DialogHeader className="px-5 pt-5 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50">
						<DialogTitle className="text-base font-semibold text-violet-900">AI Dashboard Assistant</DialogTitle>
					</DialogHeader>

					<div className="min-h-0 flex-1">
						<ScrollArea className="h-full px-5 pb-2">
							<div className="space-y-4">
								{askMessages.map((m, i) => (
									<div key={`${m.role}-${i}`} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
										<div className={`${m.role === 'user' ? 'bg-violet-600 text-white' : 'bg-violet-900 text-white'} max-w-2xl rounded-2xl px-4 py-2 shadow-sm`}>
											<div className="prose prose-invert max-w-none whitespace-pre-wrap">{m.content}</div>
										</div>
									</div>
								))}
								{isAsking && (
									<div className="flex justify-start">
										<div className="inline-flex items-center gap-2 rounded-xl bg-violet-100 px-3 py-2 text-violet-700">
											<Loader2 className="h-4 w-4 animate-spin" /> AI is thinking...
										</div>
									</div>
								)}{' '}
								<div ref={askEndRef} />
							</div>
							<ScrollBar orientation="vertical" />
						</ScrollArea>
					</div>

					<DialogFooter className="border-t border-violet-100 bg-white/80 px-5 py-3 backdrop-blur">
						<form onSubmit={handleAskSubmit} className="flex w-full items-center gap-2">
							<input
								value={askInput}
								onChange={(e) => setAskInput(e.target.value)}
								placeholder="Ask anything: order summary, upgrade suggestion, status, etc."
								className="flex-1 rounded-xl border border-violet-200 p-3 text-violet-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
							/>
							<button
								type="submit"
								disabled={isAsking}
								className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-white font-medium transition-all hover:bg-violet-700 hover:shadow-lg disabled:bg-violet-300 disabled:cursor-not-allowed"
							>
								{isAsking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
							</button>
						</form>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
