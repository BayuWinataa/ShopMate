import { createSupabaseServerClient } from '@/lib/supabase/server';
import LogoutButton from '@/components/logout-button';

export default async function DashboardPage() {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Informasi tambahan dari user metadata
	const userMetadata = user?.user_metadata || {};
	const providerInfo = user?.app_metadata?.providers?.[0] || 'email';

	return (
		<main className="min-h-screen bg-gray-50 p-6">
			<div className="mx-auto max-w-2xl bg-white rounded-xl shadow p-6">
				<h1 className="text-2xl font-bold mb-2">Dashboard (Privat)</h1>

				{user ? (
					<div className="space-y-4 mb-6">
						<div className="flex items-center gap-4">
							{userMetadata.avatar_url && <img src={userMetadata.avatar_url} alt="Profile" className="w-12 h-12 rounded-full" />}
							<div>
								<p className="text-lg font-medium">Halo, {userMetadata.full_name || user.email}</p>
								<p className="text-sm text-gray-600">{user.email}</p>
								<p className="text-xs text-gray-500 capitalize">Login via: {providerInfo}</p>
							</div>
						</div>

						<div className="bg-gray-50 p-4 rounded-lg">
							<h3 className="font-medium mb-2">Informasi Akun:</h3>
							<div className="text-sm space-y-1">
								<p>
									<strong>User ID:</strong> {user.id}
								</p>
								<p>
									<strong>Email Verified:</strong> {user.email_confirmed_at ? 'Ya' : 'Belum'}
								</p>
								<p>
									<strong>Last Sign In:</strong> {new Date(user.last_sign_in_at).toLocaleString('id-ID')}
								</p>
								<p>
									<strong>Created:</strong> {new Date(user.created_at).toLocaleString('id-ID')}
								</p>
							</div>
						</div>
					</div>
				) : (
					<p className="text-gray-600 mb-6">Tidak ada sesi login.</p>
				)}

				<LogoutButton />
			</div>
		</main>
	);
}
