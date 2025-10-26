'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '@/components/loader';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

export default function AdminLayout({ children }) {
	const { isAuthenticated, isLoading, handleLogout } = useAuth();

	if (isLoading) {
		return <Loader />;
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-violet-50/30 to-purple-50/30 flex">
			<Sidebar />
			<div className="flex-1 flex flex-col">
				<Topbar onLogout={handleLogout} />
				<main className="flex-1 overflow-auto">
					<div className="h-full p-6">
						<div className="h-full max-w-none">{children}</div>
					</div>
				</main>
			</div>
		</div>
	);
}

function useAuth() {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check if admin is authenticated via sessionStorage
		const adminAuth = sessionStorage.getItem('adminAuth');

		if (adminAuth !== 'true') {
			// Redirect to login if not authenticated
			router.replace('/login');
		} else {
			setIsAuthenticated(true);
		}
		setIsLoading(false);
	}, [router]);

	const handleLogout = () => {
		sessionStorage.removeItem('adminAuth');
		router.push('/login');
	};

	return { isAuthenticated, isLoading, handleLogout };
}


