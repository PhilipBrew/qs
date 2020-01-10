import React from 'react';
import QdtComponent from '../../../common/QdtComponent';
import Error from '../../../common/Error';
import { Link } from 'react-router-dom';
import * as Icon from 'react-feather';

// class Custom extends Component {
// 	render() {
// 		return <div />;
// 	}
// }

const Custom = props => {
	const width = props.qsObject.width
		? `col-md-${props.qsObject.width}`
		: 'col-md-12';
	return (
		<div className={width}>
			<div className="c-card" data-mh="overview-cards">
				<h4 className={'truncate'}>{props.qsObject.title}</h4>
				<div className="c-chart">
					<div className="c-chart__body">
						{props.qssOptions ? (
							<QdtComponent
								options={props.options}
								type={props.qsObject.type}
								props={{
									type: 'chart',
									id: props.qsObject.qsId,
									height: '150px'
								}}
							/>
						) : (
							<Error error={'Object preview not available'} />
						)}
					</div>
					<div className="c-chart__legends">
						<div className="row">
							<div className="col-12">
								<span className="c-chart__legend">
									<p className={'truncate'}>{props.qsObject.description}</p>
								</span>

								<span className="c-chart__legend">
									<div className="u-text-center o-line">
										<div>
											<i className="c-chart__legend-icon u-bg-info" /> Height
										</div>
										<div>{props.qsObject.height}</div>
									</div>
								</span>

								<span className="c-chart__legend">
									<div className="u-text-center o-line">
										<div>
											<i className="c-chart__legend-icon u-bg-pink" />
											Object Id
										</div>
										<div>{props.qsObject.qsId}</div>
									</div>
								</span>
								<div className="u-text-center o-line">
									<div>
										<Link to={`/settings/pages/delete-object/${props.page._id}/${props.qsObject._id}`} className="c-btn c-btn--danger c-btn--small ">
											<Icon.Slash size={10} /> Delete
										</Link>
									</div>
									<div>
										<Link to={`/settings/pages/edit-object/${props.page._id}/${props.qsObject._id}`} className="c-btn c-btn--info c-btn--small ">
											<Icon.Edit3 size={10} /> Edit
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Custom;
