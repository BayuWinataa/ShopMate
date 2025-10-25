export default function Loading() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
			{/* Breadcrumb skeleton */}
			<header className="w-full border-b bg-background/80 backdrop-blur">
				<div className="container mx-auto h-14 px-4 sm:px-6 lg:px-8 flex items-center">
					<div className="flex items-center gap-2 animate-pulse">
						<div className="h-4 w-16 bg-violet-100 rounded" />
						<div className="h-4 w-4 bg-violet-100 rounded" />
						<div className="h-4 w-20 bg-violet-100 rounded" />
						<div className="h-4 w-4 bg-violet-100 rounded" />
						<div className="h-4 w-32 bg-violet-200 rounded" />
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 animate-pulse">
					{/* Image and description skeleton */}
					<div className="space-y-4">
						<div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-violet-50 to-purple-50" />
						<div className="space-y-3 p-5 border rounded-xl">
							<div className="h-5 w-32 bg-violet-100 rounded" />
							<div className="h-px w-full bg-violet-100" />
							<div className="space-y-2">
								<div className="h-4 w-full bg-gray-200 rounded" />
								<div className="h-4 w-full bg-gray-200 rounded" />
								<div className="h-4 w-3/4 bg-gray-200 rounded" />
							</div>
						</div>
					</div>

					{/* Purchase panel skeleton */}
					<div className="space-y-4">
						<div className="border rounded-xl p-5 space-y-4">
							<div className="h-3 w-16 bg-violet-100 rounded" />
							<div className="h-10 w-40 bg-gradient-to-r from-violet-100 to-purple-100 rounded" />
							<div className="h-12 w-full bg-violet-200 rounded-lg" />
							<div className="h-12 w-full bg-gray-100 rounded-lg" />
							<div className="space-y-2 pt-4">
								<div className="h-3 w-full bg-gray-200 rounded" />
								<div className="h-3 w-full bg-gray-200 rounded" />
								<div className="h-3 w-2/3 bg-gray-200 rounded" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
