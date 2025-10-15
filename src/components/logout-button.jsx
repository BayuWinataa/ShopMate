'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
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
		<button onClick={onLogout} className={className}>
			<LogOut className="h-4 w-4 mr-2" />
			Sign Out
		</button>
	);
}
