import React         from 'react';
import PropTypes     from 'prop-types';
import QdtComponents from 'qdt-components';

class QdtComponent extends React.Component {
	constructor(props){
		super(props);
		
		this.state = {
			options : {},
			connections : {}
		}
	}
	
	componentDidMount() {
		const qdtComponents = new QdtComponents(this.props.options.config, this.props.options.connections);
		const {type, props} = this.props;
		qdtComponents.render(type, props, this.node);
		
	}
	
	componentWillUnmount() {
		QdtComponents.unmountQdtComponent(this.node)
	}
	
	render() {
		return (
			<div ref={(node) => { this.node = node; }}/>
		);
	}
}

QdtComponents.propTypes = {
	options: PropTypes.object.isRequired,
	type   : PropTypes.string.isRequired,
	props  : PropTypes.object.isRequired,
}
export default QdtComponent;
