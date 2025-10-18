import { Suspense } from 'react';
import LoginClient from './LoginClient';

export const dynamic = 'force-dynamic';

export default function Page() {
	return (
		<Suspense
			fallback={
				<div className="flex h-screen w-screen items-center justify-center bg-white">
					<p className="text-sm text-gray-500">Loading…</p>
				</div>
			}
		>
			<LoginClient />
		</Suspense>
	);
}
