import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get('code');
	const type = searchParams.get('type');
	const next = searchParams.get('next') ?? '/';

	console.log('Auth callback - code:', code, 'type:', type);

	if (code) {
		const cookieStore = await cookies();
		const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
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

		console.log('Auth callback success');

		// Cek jika ini adalah password recovery flow
		if (type === 'recovery') {
			return NextResponse.redirect(`${origin}/update-password`);
		}

		// Default redirect ke dashboard
		return NextResponse.redirect(`${origin}${next}`);
	}

	// URL tidak valid, redirect ke home
	return NextResponse.redirect(`${origin}/`);
}
