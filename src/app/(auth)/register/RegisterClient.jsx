'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import GoogleLoginButton from '@/components/google-login-button';
import Image from 'next/image';
import illustration from '../../../../public/Frame 1.svg';
import { toast } from 'sonner';
import Link from 'next/link'; // ✅ add this

export default function RegisterClient() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPwd, setShowPwd] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);

	const envOk = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	const supabase = useMemo(() => {
		if (!envOk) return null;
		return createSupabaseBrowserClient();
	}, [envOk]);

	async function onSubmit(e) {
		e.preventDefault();
		if (loading) return;

		if (!supabase) {
			setMessage({
				type: 'error',
				text: 'Supabase configuration is incomplete. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.',
			});
			return;
		}

		setLoading(true);
		setMessage(null);

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
		});

		if (error) {
			toast('Registration failed', { description: error.message });
			setMessage({ type: 'error', text: error.message });
			setLoading(false);
			return;
		}

		toast.success('Registration successful 🎉', {
			description: 'Check your email for verification. Redirecting to login...',
			duration: 2000,
		});

		setEmail('');
		setPassword('');
		setLoading(false);

		setTimeout(() => {
			router.push('/login');
			router.refresh();
		}, 2000);
	}

	const handleGoogleError = (errorMessage) => {
		toast('Google Sign-up failed', { description: errorMessage });
		setMessage({ type: 'error', text: errorMessage });
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

				{/* Right form section */}
				<main className="relative flex items-center justify-center px-4 md:px-10 pt-12 md:pt-0 pb-12 md:pb-0">
					{/* ← Back to Home */}
					<Link href="/" className="absolute top-6 left-6 text-sm text-gray-500 hover:text-gray-700 transition" aria-label="Back to Home">
						← Back to Home
					</Link>

					<div className="w-full max-w-[460px]">
						<h1 className="text-[34px] font-extrabold leading-tight text-gray-900">Create Account ✨</h1>
						<p className="mt-1 text-xl font-semibold text-gray-800">ShopMate AI</p>
						<p className="mt-1 text-sm text-gray-500">Sign up to get started. A verification link will be sent to your email.</p>

						{/* === FORM === */}
						<form onSubmit={onSubmit} className="mt-6 space-y-4">
							{/* Email */}
							<div>
								<label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
									Email
								</label>
								<input
									id="email"
									type="email"
									className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[15px] outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-emerald-400"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									placeholder="you@example.com"
									autoComplete="email"
								/>
							</div>

							{/* Password + Eye Icon */}
							<div>
								<label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
									Password
								</label>
								<div className="relative">
									<input
										id="password"
										type={showPwd ? 'text' : 'password'}
										className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-12 text-[15px] outline-none transition focus:ring-2 focus:ring-emerald-400"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										minLength={6}
										placeholder="at least 6 characters"
										autoComplete="new-password"
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
							</div>

							<button type="submit" disabled={loading} className={`mt-2 w-full rounded-full py-3 text-sm font-semibold text-white transition ${loading ? 'cursor-not-allowed bg-emerald-300' : 'bg-green-600 hover:bg-green-700'}`}>
								{loading ? 'Processing…' : 'Register'}
							</button>
						</form>

						{/* Divider */}
						<div className="my-5 flex items-center">
							<div className="h-px flex-1 bg-gray-300" />
							<span className="px-3 text-sm text-gray-500">OR</span>
							<div className="h-px flex-1 bg-gray-300" />
						</div>

						{/* === GOOGLE LOGIN === */}
						<div className="w-full">
							<GoogleLoginButton onError={handleGoogleError} />
						</div>

						{/* Feedback message */}
						{message && <p className={`mt-4 text-center text-sm ${message.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>{message.text}</p>}

						<p className="mt-6 text-center text-sm text-gray-700">
							Already have an account?{' '}
							<a href="/login" className="font-semibold text-gray-900 hover:underline">
								Login here
							</a>
						</p>
					</div>
				</main>
			</div>
		</div>
	);
}
