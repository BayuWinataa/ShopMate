import React from 'react';

const Loader = () => {
	return (
		<div className="flex h-screen w-screen items-center justify-center bg-white">
			<div className="flex flex-row gap-2">
				<div className="w-4 h-4 rounded-full bg-violet-700 animate-bounce [animation-delay:.7s]" />
				<div className="w-4 h-4 rounded-full bg-violet-700 animate-bounce [animation-delay:.3s]" />
				<div className="w-4 h-4 rounded-full bg-violet-700 animate-bounce [animation-delay:.7s]" />
			</div>
		</div>
	);
};

export default Loader;
