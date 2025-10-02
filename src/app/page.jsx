import Link from 'next/link';
import LogoutButton from '@/components/logout-button';

export default async function Home() {

	return (
		<main className="min-h-screen bg-gray-50 p-6">
			<div className="mx-auto max-w-2xl bg-white rounded-xl shadow p-6">
				<h1 className="text-2xl font-bold mb-2">Supabase Auth — Demo</h1>

				<div className="mt-6 flex items-center gap-3">
					<Link href="/login" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
						Login
					</Link>

					<Link href="/register" className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
						Register
					</Link>

					<Link href="/dashboard" className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
						Buka Dashboard (Privat)
					</Link>
				</div>
			</div>
		</main>
	);
}
