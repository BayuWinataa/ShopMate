'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import GoogleLoginButton from '@/components/google-login-button';
import Image from 'next/image';
import illustration from '../../../../public/Frame 1.svg';
import { toast } from 'sonner';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
			description: 'Check your email for verification. Redirecting to login…',
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
		toast('Google registration failed', { description: errorMessage });
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

				{/* Right form */}
				<main className="flex items-center justify-center px-4 md:px-10 pt-12 md:pt-0 pb-12 md:pb-0">
					<div className="w-full max-w-[460px]">
						<Link href="/" className="text-sm text-violet-800 hover:text-violet-900 transition">
							← Back to Home
						</Link>

						<h1 className="text-[34px] font-extrabold leading-tight text-gray-900">
							Create Account{' '}
							<span role="img" aria-label="sparkles">
								✨
							</span>
						</h1>

						<p className="mt-1 text-xl font-semibold text-violet-900">
							ShopMate <span className="text-violet-900">AI</span>
						</p>

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
										className="w-full rounded-lg caret-violet-600 border border-violet-600 bg-white px-4 py-2.5 text-[15px] outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400"
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
										placeholder="at least 6 characters"
										className="w-full rounded-lg border caret-violet-600 border-violet-600 bg-white px-4 py-2.5 pr-12 text-[15px] outline-none transition focus:ring-2 focus:ring-violet-400"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										minLength={6}
										autoComplete="new-password"
									/>

									{/* Toggle show/hide password (lucide-react) */}
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
							</div>

							<Button type="submit" variant="pressPurple" disabled={loading} className="w-full rounded-full">
								{loading ? 'Processing…' : 'Register'}
							</Button>

							{/* Divider */}
							<div className="my-5 flex items-center">
								<div className="h-px flex-1 bg-violet-600" />
								<span className="px-3 text-sm text-violet-600">OR</span>
								<div className="h-px flex-1 bg-violet-600" />
							</div>

							{/* Google */}
							<div className="w-full">
								<GoogleLoginButton onError={handleGoogleError} />
							</div>
						</form>

						{/* Error message (seragam dengan login) */}
						{message?.type === 'error' && <p className="mt-4 text-center text-sm text-red-600">{message.text}</p>}

						<p className="mt-6 text-center text-sm text-gray-700">
							Already have an account?
							<Link href="/login" className="ml-1 text-violet-800 hover:text-violet-900 font-bold hover:underline">
								Login
							</Link>
						</p>
					</div>
				</main>
			</div>
		</div>
	);
}
