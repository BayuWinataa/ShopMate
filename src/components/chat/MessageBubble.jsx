'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MessageBubble({ role, content }) {
	const isUser = role === 'user';
	const isDebateResult =
		role === 'assistant' &&
		(content?.toLowerCase().includes('perbandingan') ||
			content?.toLowerCase().includes('bandingkan') ||
			content?.toLowerCase().includes('vs') ||
			content?.toLowerCase().includes('versus') ||
			(content?.includes('Produk A') && content?.includes('Produk B')));

	return (
		<div className={`flex  ${isUser ? 'justify-end' : 'justify-start'}`}>
			<div
				className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] ${
					isUser
						? 'bg-gradient-to-br from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-200/50'
						: isDebateResult
						? 'bg-gradient-to-br from-violet-50 to-purple-50 text-violet-900 border-2 border-violet-200 shadow-lg shadow-violet-100/50 ring-1 ring-violet-300'
						: 'bg-gradient-to-br from-violet-50 to-violet-100 text-violet-900 border border-violet-200 shadow-sm'
				} rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 transition-all duration-200 hover:shadow-md`}
			>
				{isDebateResult && (
					<div className="flex items-center gap-2 mb-2 pb-2 border-b border-violet-200">
						<div className="flex items-center gap-1.5">
							<div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
							<span className="text-xs font-semibold text-violet-700 uppercase tracking-wide">Hasil Debat Produk</span>
						</div>
					</div>
				)}
				<div
					className={`${
						isUser ? 'prose-invert' : 'prose'
					} prose-sm sm:prose max-w-none break-words whitespace-pre-wrap leading-relaxed [&>*]:my-1 sm:[&>*]:my-2 [&_p]:leading-relaxed [&_pre]:text-xs sm:[&_pre]:text-sm [&_pre]:overflow-x-auto [&_code]:text-xs sm:[&_code]:text-sm ${
						isUser
							? '[&_code]:bg-violet-500/20 [&_code]:text-violet-100 [&_pre]:bg-violet-500/20 [&_pre]:border [&_pre]:border-violet-400'
							: '[&_code]:bg-violet-100 [&_code]:text-violet-800 [&_pre]:bg-violet-100 [&_pre]:border [&_pre]:border-violet-200'
					}`}
				>
					<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
				</div>
			</div>
		</div>
	);
}
