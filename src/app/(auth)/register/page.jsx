import { Suspense } from 'react';
import RegisterClient from './RegisterClient';
import Loader from '../../../components/loader';

export const dynamic = 'force-dynamic';

export default function Page() {
	return (
		<Suspense fallback={<Loader />}>
			<RegisterClient />
		</Suspense>
	);
}
