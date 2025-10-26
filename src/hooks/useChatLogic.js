'use client';

import { useEffect, useRef, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function useChatLogic({ initialAsk, chatEndRef, lastMessageRef }) {
	const supabase = createSupabaseBrowserClient();

	// chat state
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// products & recs
	const [products, setProducts] = useState([]);
	const [productsLoading, setProductsLoading] = useState(true);
	const [recommendedProducts, setRecommendedProducts] = useState([]);

	// compare
	const [comparisonList, setComparisonList] = useState([]);
	const [isComparing, setIsComparing] = useState(false);
	const [comparisonResult, setComparisonResult] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [comparedPair, setComparedPair] = useState([]);

	// follow up
	const [followupInput, setFollowupInput] = useState('');
	const [followupThread, setFollowupThread] = useState([]);
	const [isFollowupLoading, setIsFollowupLoading] = useState(false);

	const hasBootstrappedAsk = useRef(false);

	// fetch products
	useEffect(() => {
		(async () => {
			try {
				setProductsLoading(true);
				const { data, error } = await supabase.from('Products').select('*').order('created_at', { ascending: false });

				if (error) throw error;
				setProducts(data || []);
			} catch {
				setProducts([]);
			} finally {
				setProductsLoading(false);
			}
		})();
	}, [supabase]);

	// restore messages
	useEffect(() => {
		try {
			const saved = localStorage.getItem('chat_messages');
			if (saved) setMessages(JSON.parse(saved));
		} catch {}
	}, []);

	// initial ask bootstrap
	useEffect(() => {
		if (hasBootstrappedAsk.current || !initialAsk) return;
		if (messages.length > 0) return;
		hasBootstrappedAsk.current = true;

		const userMessage = { role: 'user', content: initialAsk };
		setMessages([userMessage]);
		setIsLoading(true);

		(async () => {
			try {
				const res = await fetch('/api/chat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ messages: [userMessage] }),
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || 'Unknown error');
				setMessages((p) => [...p, { role: 'assistant', content: data.reply, meta: { ids: data.ids || [] } }]);
			} catch (e) {
				setMessages((p) => [...p, { role: 'assistant', content: `Error: ${e.message}` }]);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [initialAsk, messages.length]);

	// persist + derive recommendations
	useEffect(() => {
		if (messages.length === 0 || productsLoading) return;
		try {
			localStorage.setItem('chat_messages', JSON.stringify(messages));
		} catch {}

		const last = messages[messages.length - 1];
		if (last?.role !== 'assistant') return;

		let productIds = Array.isArray(last?.meta?.ids) ? last.meta.ids.filter((x) => Number.isFinite(x)) : [];
		if (!productIds.length && typeof last.content === 'string') {
			const matches = Array.from(last.content.matchAll(/\[ID:(\d+)\]/g));
			productIds = matches.map((m) => parseInt(m[1], 10)).filter((n) => Number.isFinite(n));
		}
		const seen = new Set();
		productIds = productIds.filter((id) => (seen.has(id) ? false : (seen.add(id), true)));

		if (productIds.length) {
			const found = productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);
			setRecommendedProducts(found);
		} else {
			setRecommendedProducts([]);
		}
	}, [messages, products, productsLoading]);

	// autoscroll chat
	useEffect(() => {
		if (!lastMessageRef?.current) return;
		lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}, [messages, isLoading, lastMessageRef]);

	// compare helpers
	const isSelectedForCompare = (p) => comparisonList.some((x) => x.id === p.id);

	const toggleCompare = (product) => {
		setComparisonList((prev) => {
			const exist = prev.find((p) => p.id === product.id);
			if (exist) return prev.filter((p) => p.id !== product.id);
			if (prev.length < 2) return [...prev, product];
			return prev;
		});
	};

	const handleStartComparison = async () => {
		if (comparisonList.length !== 2) return;
		setComparedPair([comparisonList[0], comparisonList[1]]);
		setIsComparing(true);
		setComparisonResult('');
		setFollowupThread([]);
		setIsModalOpen(true);

		try {
			const res = await fetch('/api/compare', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					productA: comparisonList[0],
					productB: comparisonList[1],
					userPersona: 'Pengguna yang mencari nilai terbaik untuk uang.',
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Gagal membandingkan');
			setComparisonResult(data.reply);
		} catch (e) {
			setComparisonResult(`Terjadi kesalahan: ${e.message}`);
		} finally {
			setIsComparing(false);
		}
	};

	// send chat
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!input.trim()) return;
		const user = { role: 'user', content: input };
		const next = [...messages, user];
		setMessages(next);
		setInput('');
		setIsLoading(true);
		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: next }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Unknown error');
			setMessages((p) => [...p, { role: 'assistant', content: data.reply, meta: { ids: data.ids || [] } }]);
		} catch (e) {
			setMessages((p) => [...p, { role: 'assistant', content: `Error: ${e.message}` }]);
		} finally {
			setIsLoading(false);
		}
	};

	// followup
	const handleFollowupSubmit = async (e) => {
		e.preventDefault();
		const q = followupInput.trim();
		if (!q || comparedPair.length !== 2) return;

		const newThread = [...followupThread, { role: 'user', content: q }];
		setFollowupThread(newThread);
		setFollowupInput('');
		setIsFollowupLoading(true);

		const context =
			`KONTEKS PERBANDINGAN (WAJIB):\n` +
			`Produk A: ${JSON.stringify(comparedPair[0])}\n` +
			`Produk B: ${JSON.stringify(comparedPair[1])}\n` +
			`Ringkasan AI:\n${comparisonResult}\n` +
			`Jawab hanya terkait kedua produk. Jika tidak tahu, jujur + sarankan cara cek.`;

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: newThread, context }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Gagal jawaban lanjutan');
			setFollowupThread((p) => [...p, { role: 'assistant', content: data.reply }]);
		} catch (e) {
			setFollowupThread((p) => [...p, { role: 'assistant', content: `Error: ${e.message}` }]);
		} finally {
			setIsFollowupLoading(false);
		}
	};

	// clear chat history
	const clearChatHistory = () => {
		try {
			localStorage.removeItem('chat_messages');
			setMessages([]);
			setRecommendedProducts([]);
			setComparisonList([]);
			setComparedPair([]);
			setComparisonResult('');
			setFollowupThread([]);
			setFollowupInput('');
		} catch (error) {
			console.error('Error clearing chat history:', error);
		}
	};

	return {
		// state
		messages,
		input,
		isLoading,
		productsLoading,
		recommendedProducts,
		comparisonList,
		isComparing,
		isModalOpen,
		comparedPair,
		comparisonResult,
		followupInput,
		followupThread,
		isFollowupLoading,
		// actions
		setInput,
		handleSubmit,
		isSelectedForCompare,
		toggleCompare,
		handleStartComparison,
		setIsModalOpen,
		setFollowupInput,
		handleFollowupSubmit,
		clearChatHistory,
	};
}
