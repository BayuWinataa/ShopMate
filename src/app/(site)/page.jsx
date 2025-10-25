'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import Decor from '@/components/site/landing/Decor';
import HeroSection from '@/components/site/landing/HeroSection';
import AdvantagesSection from '@/components/site/landing/AdvantagesSection';
import InvoiceIQSection from '@/components/site/landing/InvoiceIQSection';
import FlowSection from '@/components/site/landing/FlowSection';
import CtaSection from '@/components/site/landing/CtaSection';

export default function LandingPage() {
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

	return (
		<div className="relative min-h-screen overflow-x-clip ">
			{/* <Decor /> */}
			<HeroSection />
			<AdvantagesSection />
			<InvoiceIQSection />
			<FlowSection />
			<CtaSection />
		</div>
	);
}
