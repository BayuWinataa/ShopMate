export default function Step({ num, title, desc }) {
	return (
		<div className="rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
			<div className="text-xs font-bold tracking-widest text-slate-500">{num}</div>
			<h3 className="mt-1 text-lg font-semibold">{title}</h3>
			<p className="mt-1 text-sm text-slate-600">{desc}</p>
		</div>
	);
}
