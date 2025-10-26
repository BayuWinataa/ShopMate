import { Suspense } from 'react';
import LoginClient from './LoginClient';
import Loader from '../../../components/loader';

export const dynamic = 'force-dynamic';

export const metadata = {
	title: 'Login',
	description: 'Masuk ke akun ShopMate Anda untuk melanjutkan belanja dengan AI assistant dan mengakses dashboard personal.',
	openGraph: {
		title: 'Login - ShopMate AI',
		description: 'Masuk ke akun ShopMate Anda',
	},
	robots: {
		index: false,
		follow: true,
	},
};

export default function Page() {
	return (
		<Suspense fallback={<Loader />}>
			<LoginClient />
		</Suspense>
	);
}
