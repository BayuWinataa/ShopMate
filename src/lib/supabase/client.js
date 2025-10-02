'use client';
import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseBrowserClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const key =
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || // ← pakai nama yang ada di Vercel
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // fallback kalau nanti kamu tambah ini juga

	if (!url || !key) {
		throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / PUBLISHABLE_KEY');
	}
	return createBrowserClient(url, key);
}
