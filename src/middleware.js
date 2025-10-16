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
								path: '/',
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

			// Log untuk debugging production
			if (process.env.NODE_ENV === 'production') {
				console.error('Middleware Auth Check:', {
					path: pathname,
					hasUser: !!user,
					userEmail: user?.email,
					errorMessage: error?.message,
					cookies: request.cookies.getAll().map((c) => ({ name: c.name, hasValue: !!c.value })),
				});
			}

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
