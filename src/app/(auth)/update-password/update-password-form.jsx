'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function UpdatePasswordForm() {
	const router = useRouter();
	const supabase = createSupabaseBrowserClient();
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);
	const [sessionValid, setSessionValid] = useState(null);

	// Check if we have a valid session on component mount
	useEffect(() => {
		async function checkSession() {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();

			if (error) {
				console.error('Session check error:', error);
				setMessage({ type: 'error', text: 'Error checking session: ' + error.message });
				setSessionValid(false);
				return;
			}

			if (!session) {
				setMessage({
					type: 'error',
					text: 'No active recovery session found. Please click the password reset link from your email, or request a new password reset.',
				});
				setSessionValid(false);

				// Redirect to forgot password page after a delay
				setTimeout(() => {
					router.push('/forgot-password');
				}, 5000);
				return;
			}

			// Check if this is a recovery session
			if (session.user?.recovery_sent_at || session.user?.email_change_sent_at) {
				setSessionValid(true);
			} else {
				// Check if we have any session at all
				setSessionValid(true);
				console.log('Session found:', session);
			}
		}

		checkSession();
	}, [supabase, router]);

	async function onSubmit(e) {
		e.preventDefault();
		setMessage(null);

		// Check session before proceeding
		if (sessionValid === false) {
			setMessage({
				type: 'error',
				text: 'No valid recovery session. Please request a new password reset.',
			});
			return;
		}

		if (password.length < 6) {
			setMessage({ type: 'error', text: 'Password minimal 6 karakter.' });
			return;
		}
		if (password !== confirm) {
			setMessage({ type: 'error', text: 'Konfirmasi password tidak sama.' });
			return;
		}

		setLoading(true);

		// Double-check session before updating
		const {
			data: { session },
			error: sessionError,
		} = await supabase.auth.getSession();

		if (sessionError || !session) {
			setMessage({
				type: 'error',
				text: 'Recovery session expired! Please click the password reset link from your email again.',
			});
			setLoading(false);
			return;
		}

		const { error } = await supabase.auth.updateUser({ password });

		if (error) {
			setMessage({ type: 'error', text: error.message });
			setLoading(false);
			return;
		}

		setMessage({
			type: 'success',
			text: 'Password berhasil diubah. Mengarahkan ke halaman login…',
		});

		// beri sedikit waktu untuk UX lalu arahkan ke login
		setTimeout(() => {
			router.replace('/login');
			router.refresh();
		}, 800);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
				<h1 className="text-2xl font-bold text-center mb-2">Update Password</h1>
				<p className="text-sm text-gray-500 text-center mb-6">Masukkan password baru untuk akun kamu.</p>

				{sessionValid === null && (
					<div className="text-center py-4">
						<div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
						<p className="mt-2 text-sm text-gray-500">Checking session...</p>
					</div>
				)}

				{sessionValid === false && (
					<div className="text-center py-4">
						<p className="text-red-600 text-sm">Session expired or invalid. Redirecting to login...</p>
					</div>
				)}

				{sessionValid === true && (
					<form onSubmit={onSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
							<input
								type="password"
								className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="min 6 karakter"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
							<input type="password" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
						</div>

						<button type="submit" disabled={loading} className={`w-full py-2 px-4 rounded-lg text-white font-medium ${loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
							{loading ? 'Menyimpan…' : 'Simpan Password'}
						</button>
					</form>
				)}

				{message && <p className={`mt-4 text-sm text-center ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message.text}</p>}
			</div>
		</div>
	);
}
