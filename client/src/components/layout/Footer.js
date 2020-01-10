import React, {Component} from "react";
import {connect}          from "react-redux";
import {getQsServer}      from "../../actions/qsServerActions";
import PropTypes          from "prop-types";
import isEmpty            from "../../validation/is-empty";

class Footer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			qlikLogo : null,
		}
	}

	componentWillMount(){
		if(this.props.auth.isAuthenticated){
			this.props.getQsServer();
		}
	}
	componentWillReceiveProps(nextProps, nextContext) {
		const qTicket = localStorage.getItem('qTicket');
		if (nextProps.qsServer.qsServer) {
			const secure = nextProps.qsServer.qsServer.secure === 'YES' ? true : false;
			const protocol = secure ? 'https://' : 'http://';
			const port = nextProps.qsServer.qsServer.port !== null ? parseInt(nextProps.qsServer.qsServer.port) : 80;
			const prefix = isEmpty(nextProps.qsServer.qsServer.prefix) ? '/' : `/${nextProps.qsServer.qsServer.prefix}/`;
			this.setState({
					qlikLogo : `${protocol}${nextProps.qsServer.qsServer.hostname}:${port}${prefix}resources/hub/img/core/logo/logo-76x76.png?qlikTicket=${qTicket}`
				});
		}
	}

	render(){
		const { qlikLogo } = this.state;

		return (
			<div className="container">
				<div className="row">
					<div className="col-12">
						<footer className="c-footer">
							{qlikLogo !== null ? <span className="c-footer__Link u-pt-zero"><img src={qlikLogo} width={10} alt={'qlik logo'} /></span> : null }
							<p> © 2019 CatalystiT Solutions </p>
							<span className="c-footer__divider">|</span>
							<nav>
								<span className="c-footer__link" href="#">Terms</span>
								<span className="c-footer__link" href="#">Privacy</span>
								<span className="c-footer__link" href="#">FAQ</span>
								<span className="c-footer__link" href="#">Help</span>
							</nav>
						</footer>
					</div>
				</div>
			</div>
		);
	}
};


Footer.protoTypes = {
	auth      : PropTypes.object.isRequired,
	getQsServer: PropTypes.func.isRequired,
	qsServer : PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	qsServer : state.qsServer
});

export default connect(mapStateToProps, {getQsServer})(Footer);
