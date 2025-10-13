'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const AuthContext = createContext({});

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const supabase = createSupabaseBrowserClient();

	useEffect(() => {
		// Get initial session
		const getInitialSession = async () => {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();
			if (error) {
				console.error('Error getting session:', error);
			} else {
				setUser(session?.user ?? null);
			}
			setLoading(false);
		};

		getInitialSession();

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			setUser(session?.user ?? null);
			setLoading(false);

			// Log auth events for debugging
			console.log('Auth event:', event, 'User:', session?.user?.email);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [supabase]);

	const signOut = async () => {
		setLoading(true);
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error signing out:', error);
		}
		setLoading(false);
	};

	const value = {
		user,
		loading,
		signOut,
		supabase,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
