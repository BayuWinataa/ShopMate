'use client';

import { Suspense } from 'react';
import ChatPageContent from '@/components/chat/ChatPageContent';

function ChatPageLoading() {
	return (
		<div className="h-[calc(100vh-4rem)] w-full bg-gradient-to-b from-slate-50 via-white to-white">
			<div className="container mx-auto h-full w-full flex items-center justify-center">
				<div className="text-center">
					<svg className="h-8 w-8 animate-spin mx-auto mb-4 text-violet-600" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
					</svg>
					<p className="text-violet-700">Loading chat...</p>
				</div>
			</div>
		</div>
	);
}

export default function ChatPage() {
	return (
		<Suspense fallback={<ChatPageLoading />}>
			<ChatPageContent />
		</Suspense>
	);
}
