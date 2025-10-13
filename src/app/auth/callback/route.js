import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get('code');
	const type = searchParams.get('type');
	const next = searchParams.get('next') ?? '/dashboard';
	const error = searchParams.get('error');

	console.log('Auth callback - code:', code, 'type:', type, 'error:', error);

	// Handle OAuth error
	if (error) {
		console.error('OAuth error:', error);
		return NextResponse.redirect(`${origin}/login?error=oauth_error`);
	}

	if (code) {
		const cookieStore = await cookies();
		const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => {
						cookieStore.set(name, value, options);
					});
				},
			},
		});

		const { data, error } = await supabase.auth.exchangeCodeForSession(code);

		if (error) {
			console.error('Auth callback error:', error);
			return NextResponse.redirect(`${origin}/login?error=callback_failed`);
		}

		console.log('Auth callback success for user:', data.user?.email);

		// Cek jika ini adalah password recovery flow
		if (type === 'recovery') {
			return NextResponse.redirect(`${origin}/update-password`);
		}

		// Default redirect ke dashboard atau next URL
		return NextResponse.redirect(`${origin}${next}`);
	}

	// URL tidak valid, redirect ke login
	return NextResponse.redirect(`${origin}/login`);
}
