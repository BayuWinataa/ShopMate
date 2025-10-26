import { Suspense } from 'react';
import RegisterClient from './RegisterClient';
import Loader from '../../../components/loader';

export const dynamic = 'force-dynamic';

export const metadata = {
	title: 'Daftar',
	description: 'Buat akun ShopMate gratis dan nikmati pengalaman belanja online dengan bantuan AI assistant personal Anda.',
	openGraph: {
		title: 'Daftar - ShopMate AI',
		description: 'Buat akun ShopMate gratis',
	},
	robots: {
		index: false,
		follow: true,
	},
};

export default function Page() {
	return (
		<Suspense fallback={<Loader />}>
			<RegisterClient />
		</Suspense>
	);
}
