// lib/supabase/server.js
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseServerClient() {
	const cookieStore = await cookies();

	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!url || !key) {
		throw new Error('Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.');
	}

	return createServerClient(url, key, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					try {
						const cookieOptions = {
							...options,
							// Ensure cookies work in both development and production
							secure: process.env.NODE_ENV === 'production',
							sameSite: 'lax',
							httpOnly: false,
							path: '/',
						};
						cookieStore.set(name, value, cookieOptions);
					} catch (error) {
						// Ignore errors in read-only contexts
						console.warn('Failed to set cookie:', name, error.message);
					}
				});
			},
		},
	});
}
