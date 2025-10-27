import { CheckCircle2 } from 'lucide-react';

export default function Li({ children }) {
	// Return a fragment: the parent <motion.li> will be the actual list item.
	return (
		<>
			<CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden /> {children}
		</>
	);
}
