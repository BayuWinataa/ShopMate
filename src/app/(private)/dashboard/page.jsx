import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Separator } from '@/components/ui/separator';
import DashboardClient from '@/components/dashboard/DashboardClient';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	// Log untuk debugging production
	if (process.env.NODE_ENV === 'production') {
		console.error('Dashboard Auth Check:', {
			hasUser: !!user,
			userEmail: user?.email,
			errorMessage: error?.message,
		});
	}

	if (error || !user) {
		redirect('/login?next=/dashboard');
	}

	return (
		<div className="space-y-3">
			<h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Selamat datang, <span className="font-semibold">{user.user_metadata?.name || user.email}</span>.
			</p>
			<Separator />

			<DashboardClient />
		</div>
	);
}
