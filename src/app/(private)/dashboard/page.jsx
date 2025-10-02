import { createSupabaseServerClient } from '@/lib/supabase/server';
import LogoutButton from '@/components/logout-button';

export default async function DashboardPage() {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return (
		<main className="min-h-screen bg-gray-50 p-6">
			<div className="mx-auto max-w-2xl bg-white rounded-xl shadow p-6">
				<h1 className="text-2xl font-bold mb-2">Dashboard (Privat)</h1>
				<p className="text-gray-600 mb-6">{user ? `Halo, ${user.email}` : 'Tidak ada sesi login.'}</p>
				<LogoutButton />
			</div>
		</main>
	);
}
