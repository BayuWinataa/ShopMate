import Header from '@/components/site/Header';
import Footer from '@/components/footer';

export default function SiteLayout({ children }) {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
