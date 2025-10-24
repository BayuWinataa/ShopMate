'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import GoogleLoginButton from '@/components/google-login-button';
import Image from 'next/image';
import illustration from '../../../../public/Frame 1.svg';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
		<div className="fixed inset-0 h-[100svh] w-screen overflow-auto md:overflow-hidden bg-white ">
			<div className="grid h-full w-full grid-rows-[auto_1fr] md:grid-rows-1 md:grid-cols-2">
				{/* Left illustration */}
				<aside className="relative hidden md:block ">
					<div className="relative z-10 flex h-full w-full items-center justify-center">
						<div className="relative h-full w-full">
							<Image src={illustration} alt="Illustration" fill className="object-cover" priority />
						</div>
					</div>
				</aside>

				{/* Right form */}
				<main className="flex items-center justify-center px-4 md:px-10 pt-12 md:pt-0 pb-12 md:pb-0">
					<div className="w-full max-w-[460px]">
						<Link href="/" className=" top-6 left-6 text-sm text-violet-800 hover:text-violet-900 transition">
							← Back to Home
						</Link>
						<h1 className="text-[34px] font-extrabold leading-tight text-gray-900 ">
							Welcome Back!{' '}
							<span role="img" aria-label="wave">
								👋
							</span>
						</h1>

						<p className="mt-1 text-xl font-semibold text-violet-900 ">
							ShopMate <span className="text-violet-900">AI</span>
						</p>

						<form onSubmit={onSubmit} className="mt-6 space-y-4">
							{/* Email */}
							<div>
								<label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700 ">
									Email
								</label>
								<div className="relative">
									<input
										id="email"
										type="email"
										placeholder="you@example.com"
										className="w-full rounded-lg caret-violet-600 border border-violet-600  bg-white  px-4 py-2.5 text-[15px] outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										autoComplete="email"
									/>
								</div>
							</div>

							{/* Password */}
							<div>
								<label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700 ">
									Password
								</label>
								<div className="relative">
									<input
										id="password"
										type={showPwd ? 'text' : 'password'}
										placeholder="*****"
										className="w-full rounded-lg border caret-violet-600 border-violet-600 bg-white  px-4 py-2.5 pr-12 text-[15px] outline-none transition focus:ring-2 focus:ring-violet-400"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										autoComplete="current-password"
									/>

									{/* Toggle show/hide password dengan lucide-react */}
									<button
										type="button"
										onClick={() => setShowPwd((v) => !v)}
										aria-label={showPwd ? 'Hide password' : 'Show password'}
										aria-pressed={showPwd}
										className="absolute inset-y-0 right-3 flex items-center rounded p-1 text-gray-500 hover:text-violet-500"
									>
										{showPwd ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
									</button>
								</div>

								{/* <div className="mt-2 text-right">
									<Link href="/forgot-password" className="text-xs font-medium text-violet-800 hover:text-violet-900 hover:underline">
										Forgot password?
									</Link>
								</div> */}
							</div>

							<Button type="submit" variant="pressPurple" disabled={loading} className={`w-full rounded-full `}>
								{loading ? 'Processing…' : 'Login'}
							</Button>

							<div className="my-5 flex items-center">
								<div className="h-px flex-1 bg-violet-600 " />
								<span className="px-3 text-sm text-violet-600 ">OR</span>
								<div className="h-px flex-1 bg-violet-600 " />
							</div>

							<div className="w-full">
								<GoogleLoginButton onError={handleGoogleError} />
							</div>
						</form>

						{message?.type === 'error' && <p className="mt-4 text-center text-sm text-red-600">{message.text}</p>}

						<p className="mt-6 text-center text-sm text-gray-700 ">
							Don’t have an account?
							<Link href="/register" className="ml-1 text-violet-800 font-bold hover:text-violet-900 hover:underline">
								Register
							</Link>
						</p>
					</div>
				</main>
			</div>
		</div>
	);
}
