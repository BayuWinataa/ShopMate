'use client';

import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import SplashScreen from '@/components/SplashScreen';
import Decor from '@/components/site/landing/Decor';
import HeroSection from '@/components/site/landing/HeroSection';
import AdvantagesSection from '@/components/site/landing/AdvantagesSection';
import InvoiceIQSection from '@/components/site/landing/InvoiceIQSection';
import FlowSection from '@/components/site/landing/FlowSection';
import CtaSection from '@/components/site/landing/CtaSection';

// SEO metadata will be inherited from root layout
// This page represents the home/landing page

export default function LandingPage() {
	const [showSplash, setShowSplash] = useState(false);

	useEffect(() => {
		// Show splash only once per user (persisted). Use localStorage so splash
		// won't reappear on reloads or new sessions on the same device.
		try {
			const splashShown = localStorage.getItem('shopmate.splashShown');
			if (!splashShown) {
				setShowSplash(true);
			}
		} catch (err) {
			// If localStorage is unavailable (e.g. strict privacy mode), fallback to session-only behavior
			const splashShown = sessionStorage.getItem('splashShown');
			if (!splashShown) setShowSplash(true);
		}
	}, []);

	useEffect(() => {
		// Initialize Lenis
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: 'vertical',
			gestureOrientation: 'vertical',
			smoothWheel: true,
			wheelMultiplier: 1,
			smoothTouch: false,
			touchMultiplier: 2,
			infinite: false,
		});

		// Lenis scroll function
		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		// Cleanup
		return () => {
			lenis.destroy();
		};
	}, []);

	const handleSplashComplete = () => {
		setShowSplash(false);
		try {
			localStorage.setItem('shopmate.splashShown', 'true');
		} catch (err) {
			// Fallback if localStorage not writable
			sessionStorage.setItem('splashShown', 'true');
		}
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebSite',
						name: 'ShopMate AI',
						url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
						description: 'Platform e-commerce modern dengan AI assistant untuk pengalaman belanja yang lebih cerdas',
						potentialAction: {
							'@type': 'SearchAction',
							target: {
								'@type': 'EntryPoint',
								urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products?search={search_term_string}`,
							},
							'query-input': 'required name=search_term_string',
						},
					}),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Organization',
						name: 'ShopMate AI',
						url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
						logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo.png`,
						description: 'E-commerce platform dengan AI shopping assistant',
						contactPoint: {
							'@type': 'ContactPoint',
							contactType: 'Customer Service',
							availableLanguage: ['Indonesian', 'English'],
						},
					}),
				}}
			/>

			{showSplash && <SplashScreen onComplete={handleSplashComplete} />}

			{!showSplash && (
				<div className="relative min-h-screen overflow-x-clip ">
					{/* <Decor /> */}
					<HeroSection />
					<AdvantagesSection />
					<InvoiceIQSection />
					<FlowSection />
					<CtaSection />
				</div>
			)}
		</>
	);
}
