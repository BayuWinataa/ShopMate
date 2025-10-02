'use client';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function RegisterPage() {
	const supabase = createSupabaseBrowserClient();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);

	async function onSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
		});

		if (error) {
			setMessage({ type: 'error', text: error.message });
		} else {
			setMessage({
				type: 'success',
				text: 'Registrasi berhasil! Cek email kamu untuk verifikasi.',
			});
			setEmail('');
			setPassword('');
		}

		setLoading(false);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
				<h1 className="text-2xl font-bold text-center mb-2">Register</h1>
				<p className="text-sm text-gray-500 text-center mb-6">Masukkan email & password. Setelah daftar, cek email untuk verifikasi.</p>

				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<input type="email" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="kamu@example.com" />
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
						<input
							type="password"
							className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={6}
							placeholder="min 6 karakter"
						/>
					</div>

					<button type="submit" disabled={loading} className={`w-full py-2 px-4 rounded-lg text-white font-medium ${loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
						{loading ? 'Memproses…' : 'Daftar'}
					</button>
				</form>

				{message && <p className={`mt-4 text-sm text-center ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message.text}</p>}
				<p className="text-center text-sm text-gray-600 mt-6">
					sudah punya akun?{' '}
					<a href="/login" className="text-indigo-600 hover:underline">
						Login di sini
					</a>
				</p>
			</div>
		</div>
	);
}
