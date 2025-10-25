import { CheckCircle2 } from 'lucide-react';

export default function Li({ children }) {
	return (
		<li className="inline-flex items-center gap-2">
			<CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden /> {children}
		</li>
	);
}
