'use client';
export default function FlowStep({ num, title, desc }) {
	return (
		<div className="relative flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white/80 dark:bg-neutral-900/60 backdrop-blur p-5 shadow-sm hover:shadow-md transition hover:-translate-y-0.5">
			<div className="relative shrink-0">
				<span aria-hidden="true" className="absolute -left-6 top-3 size-3 rounded-full bg-violet-600 ring-4 ring-violet-200 md:left-1/2 md:-top-8 md:-translate-x-1/2" />
				<div className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-sm ring-1 ring-white/20">{num}</div>
			</div>
			<div className="min-w-0">
				<h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{desc}</p>
			</div>
		</div>
	);
}
