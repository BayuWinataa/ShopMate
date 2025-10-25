export default function Adv({ icon, title, desc }) {
	return (
		<div className="group relative rounded-2xl border border-violet-200/50 dark:border-violet-800/30 bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl p-6 shadow-lg shadow-violet-500/5 ring-1 ring-violet-500/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/20 hover:border-violet-300 dark:hover:border-violet-700 overflow-hidden">
			{/* Gradient background on hover */}
			<div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

			{/* Shine effect */}
			<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
				<div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
			</div>

			<div className="relative">
				{/* Icon with gradient background */}
				<div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
					{icon}
				</div>

				<h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-gray-50 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{title}</h3>

				<p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>

				{/* Decorative corner accent */}
				<div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-violet-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			</div>
		</div>
	);
}
