'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function GoogleLoginButton({ onError }) {
	const [loading, setLoading] = useState(false);
	const searchParams = useSearchParams();
	const supabase = createSupabaseBrowserClient();

	const handleGoogleLogin = async () => {
		try {
			setLoading(true);

			// Get redirect URL from query params
			const redirectTo = searchParams.get('next') || '/dashboard';

			// Build callback URL - ensure it's correct for both dev and prod
			const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
			const callbackUrl = `${baseUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`;

			console.log('Google OAuth - Base URL:', baseUrl);
			console.log('Google OAuth - Callback URL:', callbackUrl);
			console.log('Google OAuth - Environment:', process.env.NODE_ENV);
			console.log('Google OAuth - Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: callbackUrl,
					queryParams: {
						access_type: 'online',
						prompt: 'consent',
					},
				},
			});

			if (error) {
				console.error('Google login error:', error);
				if (onError) onError(error.message);
			} else {
				console.log('Google OAuth initiated successfully');
			}
		} catch (error) {
			console.error('Unexpected error during Google login:', error);
			if (onError) onError('Terjadi kesalahan saat login dengan Google');
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			onClick={handleGoogleLogin}
			disabled={loading}
			type="button"
			className={`w-full flex items-center rounded-full justify-center gap-3 text-purple-700 border border-purple-700 px-4 py-2  
  shadow-[0_4px_0_#6b21a8] active:shadow-none active:translate-y-[4px] 
  transition-all duration-150`}
		>
			{loading ? (
				<div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
			) : (
				<svg className="w-5 h-5" viewBox="0 0 24 24">
					<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
					<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
					<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
					<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
				</svg>
			)}
			{loading ? 'Memproses...' : 'Continue with Google'}
		</button>
	);
}
