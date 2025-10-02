'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
	const searchParams = useSearchParams();
	const supabase = createSupabaseBrowserClient();
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);

	// Check for error messages from URL parameters
	useEffect(() => {
		const error = searchParams.get('error');
		if (error === 'invalid_recovery_link') {
			setMessage({
				type: 'error',
				text: 'Invalid or expired password reset link. Please request a new one below.',
			});
		}
	}, [searchParams]);

	async function onSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		// Gunakan auth/callback route untuk handle code exchange dengan benar
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
		});

		if (error) {
			setMessage({ type: 'error', text: error.message });
		} else {
			setMessage({
				type: 'success',
				text: 'Link reset password sudah dikirim. Cek email kamu.',
			});
			setEmail('');
		}

		setLoading(false);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
				<h1 className="text-2xl font-bold text-center mb-2">Lupa Password</h1>
				<p className="text-sm text-gray-500 text-center mb-6">Masukkan email akun kamu. Kami akan kirim tautan untuk ganti password.</p>

				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<input type="email" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="kamu@example.com" />
					</div>

					<button type="submit" disabled={loading} className={`w-full py-2 px-4 rounded-lg text-white font-medium ${loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
						{loading ? 'Mengirim…' : 'Kirim Link Reset'}
					</button>
				</form>

				{message && <p className={`mt-4 text-sm text-center ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message.text}</p>}
			</div>
		</div>
	);
}
