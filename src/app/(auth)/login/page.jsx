import { Suspense } from 'react';
import LoginClient from './LoginClient';
import Loader from '../../../components/loader';

export const dynamic = 'force-dynamic';

export default function Page() {
	return (
		<Suspense fallback={<Loader />}>
			<LoginClient />
		</Suspense>
	);
}
