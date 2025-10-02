'use client';

import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LogoutButton({ className = '' }) {
	const router = useRouter();
	const supabase = createSupabaseBrowserClient();

	async function onLogout() {
		await supabase.auth.signOut();
		// refresh agar server components membaca session baru (tidak login)
		router.replace('/');
		router.refresh();
	}

	return (
		<button onClick={onLogout} className={`px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-black ${className}`}>
			Logout
		</button>
	);
}
