// middleware.js
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request) {
	const { pathname } = request.nextUrl;
	const isProtected = pathname.startsWith('/dashboard');

	if (isProtected) {
		let response = NextResponse.next({
			request: {
				headers: request.headers,
			},
		});

		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
			{
				cookies: {
					getAll() {
						return request.cookies.getAll();
					},
					setAll(cookiesToSet) {
						cookiesToSet.forEach(({ name, value, options }) => {
							response.cookies.set(name, value, {
								...options,
								// Ensure cookies work in both development and production
								secure: process.env.NODE_ENV === 'production',
								sameSite: 'lax',
								httpOnly: false,
							});
						});
					},
				},
			}
		);

		try {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();

			if (error || !user) {
				const loginUrl = new URL('/login', request.url);
				loginUrl.searchParams.set('redirectedFrom', pathname);
				return NextResponse.redirect(loginUrl);
			}

			return response;
		} catch (err) {
			console.error('Middleware error:', err);
			const loginUrl = new URL('/login', request.url);
			loginUrl.searchParams.set('redirectedFrom', pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard/:path*'],
};
