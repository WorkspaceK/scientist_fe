import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import PublicationList from "./PublicationList";
import AddPublication from "./AddPublication";
import EditPublication from "./EditPublication";
import CopyPublication from "./CopyPublication";

const Publication = props => {
  const { match } = props
	return (
		<Switch>
			<Route path={`${match.url}/publication-list`} component={PublicationList} />
			<Route path={`${match.url}/add-publication`} component={AddPublication} />
			<Route path={`${match.url}/edit-publication`} component={EditPublication} />
			<Route path={`${match.url}/copy-publication/`} component={CopyPublication} />
			{/*<Route path={`${match.url}/view-detail/:id`} component={ViewDetail} />*/}
			{/*<Route path={`${match.url}/view-action`} component={ViewAction} />*/}
			{/*<Route path={`${match.url}/import-publication`} component={ImportPublication} />*/}
			{/*<Route path={`${match.url}/export-publication`} component={ExportPublication} />*/}
			{/*<Route path={`${match.url}/publication-recycle`} component={PublicationRecycle} />*/}
			<Redirect exact from={`${match.url}`} to={`${match.url}/publication-list`} />
		</Switch>
	)
}

export default Publication