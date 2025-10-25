'use client';

import Decor from '@/components/site/landing/Decor';
import HeroSection from '@/components/site/landing/HeroSection';
import AdvantagesSection from '@/components/site/landing/AdvantagesSection';
import InvoiceIQSection from '@/components/site/landing/InvoiceIQSection';
import FlowSection from '@/components/site/landing/FlowSection';
import CtaSection from '@/components/site/landing/CtaSection';

export default function LandingPage() {
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
