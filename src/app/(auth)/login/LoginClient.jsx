'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import GoogleLoginButton from '@/components/google-login-button';
import Image from 'next/image';
import illustration from '../../../../public/Frame 1.svg';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginClient() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const supabase = createSupabaseBrowserClient();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPwd, setShowPwd] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);

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
				text: 'Session required for password update. Please log in first.',
			});
		} else if (err === 'callback_failed') {
			setMessage({
				type: 'error',
				text: 'Google login failed. Please try again.',
			});
		} else if (err === 'oauth_error') {
			setMessage({
				type: 'error',
				text: 'An error occurred while logging in with Google. Please try again.',
			});
		}
	}, [searchParams]);

	const onSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			if (loading) return;

			setLoading(true);
			setMessage(null);

			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				toast('Login failed', { description: error.message });
				setMessage({ type: 'error', text: error.message });
				setLoading(false);
				return;
			}

			toast.success('Login successful 🎉', {
				description: 'Redirecting to your dashboard…',
				duration: 1500,
			});

			const redirectTo = searchParams.get('next') || '/dashboard';
			router.push(redirectTo);
			router.refresh();
		},
		[email, password, supabase, router, loading, searchParams]
	);

	const handleGoogleError = (msg) => {
		toast('Google login failed', { description: msg });
		setMessage({ type: 'error', text: msg });
	};

	return (
		<div className="fixed inset-0 h-[100svh] w-screen overflow-auto md:overflow-hidden bg-white">
			<div className="grid h-full w-full grid-rows-[auto_1fr] md:grid-rows-1 md:grid-cols-2">
				{/* Left illustration */}
				<aside className="relative hidden md:block">
					<div className="relative z-10 flex h-full w-full items-center justify-center">
						<div className="relative h-full w-full">
							<Image src={illustration} alt="Illustration" fill className="object-cover" priority />
						</div>
					</div>
				</aside>

				{/* Right form */}
				<main className="flex items-center justify-center px-4 md:px-10 pt-12 md:pt-0 pb-12 md:pb-0">
					<div className="w-full max-w-[460px]">
						<h1 className="text-[34px] font-extrabold leading-tight text-gray-900">
							Welcome Back!{' '}
							<span role="img" aria-label="wave">
								👋
							</span>
						</h1>
						<p className="mt-1 text-xl font-semibold text-gray-800">ShopMate AI</p>
						<p className="mt-1 text-sm text-gray-500">Nice to see you again.</p>

						<form onSubmit={onSubmit} className="mt-6 space-y-4">
							{/* Email */}
							<div>
								<label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
									Email
								</label>
								<div className="relative">
									<input
										id="email"
										type="email"
										placeholder="you@example.com"
										className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[15px] outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-emerald-400"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										autoComplete="email"
									/>
								</div>
							</div>

							{/* Password */}
							<div>
								<label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
									Password
								</label>
								<div className="relative">
									<input
										id="password"
										type={showPwd ? 'text' : 'password'}
										placeholder="••••••"
										className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-12 text-[15px] outline-none transition focus:ring-2 focus:ring-emerald-400"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										autoComplete="current-password"
									/>
									<button
										type="button"
										onClick={() => setShowPwd((v) => !v)}
										aria-label={showPwd ? 'Hide password' : 'Show password'}
										aria-pressed={showPwd}
										className="absolute inset-y-0 right-3 flex items-center rounded p-1 text-gray-500 hover:text-gray-700"
									>
										{showPwd ? (
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="1.5"
													d="M3 3l18 18M10.58 10.59A3 3 0 0012 15a3 3 0 002.83-3.94M6.53 6.53C4.74 7.61 3.32 9.19 2.25 12c2.5 6 8 7.5 9.75 7.5 1.1 0 5.82-.6 9-6-1.02-2.45-2.5-4.03-4.28-5.11"
												/>
											</svg>
										) : (
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 12c3.18 5.4 7.9 6 9 6s5.82-.6 9-6c-3.18-5.4-7.9-6-9-6s-5.82.6-9 6z" />
												<circle cx="12" cy="12" r="3" strokeWidth="1.5" />
											</svg>
										)}
									</button>
								</div>

								<div className="mt-2 text-right">
									<Link href="/forgot-password" className="text-xs font-medium text-gray-500 hover:underline">
										Forgot password?
									</Link>
								</div>
							</div>

							<button type="submit" disabled={loading} className={`mt-2 w-full rounded-full py-3 text-sm font-semibold text-white transition ${loading ? 'cursor-not-allowed bg-green-300' : 'bg-green-600 hover:bg-green-700'}`}>
								{loading ? 'Processing…' : 'Login'}
							</button>

							<div className="my-5 flex items-center">
								<div className="h-px flex-1 bg-gray-300" />
								<span className="px-3 text-sm text-gray-500">OR</span>
								<div className="h-px flex-1 bg-gray-300" />
							</div>

							<div className="w-full">
								<GoogleLoginButton onError={handleGoogleError} />
							</div>
						</form>

						{message?.type === 'error' && <p className="mt-4 text-center text-sm text-red-600">{message.text}</p>}

						<p className="mt-6 text-center text-sm text-gray-700">
							Don’t have an account?
							<Link href="/register" className="ml-1 font-semibold text-gray-900 hover:underline">
								Register
							</Link>
						</p>
					</div>
				</main>
			</div>
		</div>
	);
}
