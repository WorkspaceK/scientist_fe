import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import PersonList from "./PersonList";
import AddPerson from "./AddPerson";
import EditPerson from "./EditPerson";
import CopyPerson from "./CopyPerson";
import ViewMassCopy from "./ViewMassCopy";
import EditCopyPerson from "./ViewDetail";

const Person = props => {
  const { match } = props
	return (
		<Switch>
			<Route path={`${match.url}/person-list`} component={PersonList} />
			<Route path={`${match.url}/add-person`} component={AddPerson} />
			<Route path={`${match.url}/edit-person`} component={EditPerson} />
			<Route path={`${match.url}/copy-person/`} component={CopyPerson} />
			<Route path={`${match.url}/view-mass-copy`} component={ViewMassCopy} />
			<Route path={`${match.url}/EditCopyPerson`} component={EditCopyPerson} />

			{/*<Route path={`${match.url}/view-detail/:id`} component={ViewDetail} />*/}
			{/*<Route path={`${match.url}/view-action`} component={ViewAction} />*/}
			{/*<Route path={`${match.url}/import-person`} component={ImportPerson} />*/}
			{/*<Route path={`${match.url}/export-person`} component={ExportPerson} />*/}
			{/*<Route path={`${match.url}/person-recycle`} component={PersonRecycle} />*/}
			<Redirect exact from={`${match.url}`} to={`${match.url}/person-list`} />
		</Switch>
	)
}

export default Person