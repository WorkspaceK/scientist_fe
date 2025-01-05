import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';

const Managements = ({ match }) => {
  return(
  <Suspense fallback={<Loading cover="content"/>}>
    <Switch>
      <Route path={`${match.url}/categories`} component={lazy(() => import(`./categories`))} />
      <Route path={`${match.url}/person`} component={lazy(() => import(`./person`))} />
      <Route path={`${match.url}/publication`} component={lazy(() => import(`./publication`))} />
      {/*<Route path={`${match.url}/demo`} component={lazy(() => import(`./demo`))} />*/}
      <Redirect from={`${match.url}`} to={`${match.url}/categories`} />
    </Switch>
  </Suspense>
)};

export default Managements