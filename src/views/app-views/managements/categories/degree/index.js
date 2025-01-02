import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import List from "./List";

import Edit from "./Edit";
import Copy from "./Copy";
import ViewMassCopy from "./ViewMassCopy";
import EditCopy from "./ViewDetail";
import Add from "./Add";

const Degree = props => {
  const { match } = props
	return (
		<Switch>
			<Route path={`${match.url}/list`} component={List} />
			<Route path={`${match.url}/add`} component={Add} />
			<Route path={`${match.url}/edit`} component={Edit} />
			<Route path={`${match.url}/copy/`} component={Copy} />
			<Route path={`${match.url}/view-mass-copy`} component={ViewMassCopy} />
			<Route path={`${match.url}/EditCopy`} component={EditCopy} />

			{/*<Route path={`${match.url}/view-detail/:id`} component={ViewDetail} />*/}
			{/*<Route path={`${match.url}/view-action`} component={ViewAction} />*/}
			{/*<Route path={`${match.url}/import`} component={Import} />*/}
			{/*<Route path={`${match.url}/export`} component={Export} />*/}
			{/*<Route path={`${match.url}/recycle`} component={Recycle} />*/}
			<Redirect exact from={`${match.url}`} to={`${match.url}/list`} />
		</Switch>
	)
}

export default Degree