// lib/supabase/server.js
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createSupabaseServerClient() {
	const cookieStore = cookies(); // ⬅️ tidak async

	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!url || !key) {
		throw new Error('Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL dan PUBLISHABLE_KEY/ANON_KEY.');
	}

	return createServerClient(url, key, {
		cookies: {
			get(name) {
				return cookieStore.get(name)?.value;
			},
			set(name, value, options) {
				// Di Server Component murni ini tidak akan jalan (read-only).
				// Gunakan di Route Handler / Server Action saat butuh set cookie.
				cookieStore.set({ name, value, ...options });
			},
			remove(name, options) {
				cookieStore.set({ name, value: '', ...options, maxAge: 0 });
			},
		},
	});
}
