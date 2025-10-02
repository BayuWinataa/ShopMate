// middleware.js
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request) {
	const { pathname } = request.nextUrl;
	const isProtected = pathname.startsWith('/dashboard');

	if (isProtected) {
		let response = NextResponse.next();

		const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => {
						response.cookies.set(name, value, options);
					});
				},
			},
		});

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
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard/:path*'],
};
