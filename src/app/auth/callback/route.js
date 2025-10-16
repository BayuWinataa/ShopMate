import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get('code');
	const type = searchParams.get('type');
	const next = searchParams.get('next') ?? '/dashboard';
	const error = searchParams.get('error');

	console.log('Auth callback received:', {
		hasCode: !!code,
		type,
		error,
		origin,
		next,
		searchParams: Object.fromEntries(searchParams.entries())
	});

	// Handle OAuth error
	if (error) {
		console.error('OAuth error:', error);
		return NextResponse.redirect(`${origin}/login?error=oauth_error`);
	}

	if (code) {
		const cookieStore = await cookies();

		let response = NextResponse.redirect(`${origin}${next}`);

		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL, 
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 
			{
				cookies: {
					getAll() {
						return cookieStore.getAll();
					},
					setAll(cookiesToSet) {
						cookiesToSet.forEach(({ name, value, options }) => {
							const cookieOptions = {
								...options,
								// Ensure cookies work in both development and production
								secure: process.env.NODE_ENV === 'production',
								sameSite: 'lax',
								httpOnly: false,
								path: '/',
							};
							
							try {
								cookieStore.set(name, value, cookieOptions);
								response.cookies.set(name, value, cookieOptions);
							} catch (err) {
								console.error('Failed to set cookie:', name, err.message);
							}
						});
					},
				},
			}
		);

		const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

		if (exchangeError) {
			console.error('Auth callback error:', {
				error: exchangeError.message,
				code: exchangeError.code,
				details: exchangeError
			});
			return NextResponse.redirect(`${origin}/login?error=callback_failed`);
		}

		console.log('Auth callback success:', {
			userEmail: data.user?.email,
			userId: data.user?.id,
			hasSession: !!data.session
		});

		// Cek jika ini adalah password recovery flow
		if (type === 'recovery') {
			return NextResponse.redirect(`${origin}/update-password`);
		}

		// Default redirect ke dashboard atau next URL
		return response;
	}

	// URL tidak valid, redirect ke login
	return NextResponse.redirect(`${origin}/login`);
}
