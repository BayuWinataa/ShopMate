import { Card, CardContent } from '@/components/ui/card';

export default function HeroCard({ icon, title, desc }) {
	return (
		<Card className="border-transparent bg-white/70 shadow-sm ring-1 ring-black/5 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md">
			<CardContent className="p-5">
				<div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/10 text-violet-700 ring-1 ring-violet-600/20">{icon}</div>
				<h3 className="mt-3 text-base font-semibold">{title}</h3>
				<p className="mt-1 text-sm text-slate-600">{desc}</p>
			</CardContent>
		</Card>
	);
}
