import React  from 'react';
import Loader from "react-loader-spinner";

const Loading = () => {
	return (
		<div className="u-text-center u-m-auto u-mt-xlarge u-pt-large">
			<Loader
				type="Triangle"
				color="#f19012"
				height="250"
				width="250"
			/>
		</div>
	);
};

export default Loading;
