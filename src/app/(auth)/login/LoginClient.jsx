'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginClient() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const supabase = createSupabaseBrowserClient();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null); 

	// Baca error dari query string (?error=...)
	useEffect(() => {
		const err = searchParams.get('error');
		if (err === 'invalid_recovery_link') {
			setMessage({
				type: 'error',
				text: 'Invalid or expired password reset link. Please request a new one.',
			});
		} else if (err === 'session_required') {
			setMessage({
				type: 'error',
				text: 'Session required for password update. Please login first.',
			});
		}
	}, [searchParams]);

	const onSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			if (loading) return;

			setLoading(true);
			setMessage(null);

			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				setMessage({ type: 'error', text: error.message });
				setLoading(false);
				return;
			}

			setMessage({ type: 'success', text: 'Login berhasil! Mengarahkan ke dashboard...' });

			setTimeout(() => {
				router.push('/dashboard');
			}, 1000);
		},
		[email, password, supabase, router, loading]
	);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
				<h1 className="text-2xl font-bold text-center mb-2">Login</h1>
				<p className="text-sm text-gray-500 text-center mb-6">Masukkan email & password yang sudah terdaftar.</p>

				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<input
							type="email"
							className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							placeholder="kamu@example.com"
							autoComplete="email"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
						<input
							type="password"
							className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							placeholder="••••••"
							autoComplete="current-password"
						/>
					</div>

					<button type="submit" disabled={loading} className={`w-full py-2 px-4 rounded-lg text-white font-medium ${loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
						{loading ? 'Memproses…' : 'Masuk'}
					</button>
				</form>

				{message && <p className={`mt-4 text-sm text-center ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message.text}</p>}

				<p className="text-center text-sm text-gray-600 mt-6">
					Belum punya akun?{' '}
					<a href="/register" className="text-indigo-600 hover:underline">
						Daftar di sini
					</a>
				</p>
			</div>
		</div>
	);
}
