import { Suspense } from 'react';
import LoginClient from './LoginClient';

export const dynamic = 'force-dynamic'; 

export default function Page() {
	return (
		<Suspense fallback={<div className="flex justify-center items-center text-sm text-gray-500">Loading…</div>}>
			<LoginClient />
		</Suspense>
	);
}
