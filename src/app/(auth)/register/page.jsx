import { Suspense } from 'react';
import RegisterClient from './RegisterClient';

export const dynamic = 'force-dynamic'; 

export default function Page() {
	return (
		<Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading…</div>}>
			<RegisterClient />
		</Suspense>
	);
}
