export default function Decor() {
	return (
		<>
			<div
				aria-hidden
				className="pointer-events-none absolute -top-52 left-1/2 h-[560px] w-[1200px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
				style={{
					background: 'radial-gradient(closest-side, rgba(59,130,246,.28), transparent 60%), radial-gradient(closest-side, rgba(99,102,241,.28), transparent 60%)',
				}}
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute top-56 right-[-20%] h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
				style={{
					background: 'radial-gradient(closest-side, rgba(147,51,234,.25), transparent 60%), radial-gradient(closest-side, rgba(59,130,246,.22), transparent 60%)',
				}}
			/>
		</>
	);
}
