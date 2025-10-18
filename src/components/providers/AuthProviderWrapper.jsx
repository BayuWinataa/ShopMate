'use client';

import { AuthProvider } from '@/lib/auth-context';

export default function AuthProviderWrapper({ children }) {
	return <AuthProvider>{children}</AuthProvider>;
}
