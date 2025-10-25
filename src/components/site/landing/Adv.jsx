export default function Adv({ icon, title, desc }) {
	return (
		<div className="group rounded-2xl border border-slate-200/80 bg-white/70 p-5 ring-1 ring-black/5 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md">
			<div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">{icon}</div>
			<h3 className="mt-3 text-base font-semibold">{title}</h3>
			<p className="mt-1 text-sm text-slate-600">{desc}</p>
		</div>
	);
}
