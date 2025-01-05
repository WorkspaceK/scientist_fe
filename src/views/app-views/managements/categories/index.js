import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';

const Categories = ({ match }) => {
    return(
        <Suspense fallback={<Loading cover="content"/>}>
            <Switch>
                <Route path={`${match.url}/degree`} component={lazy(() => import(`./degree`))} />
                <Redirect from={`${match.url}`} to={`${match.url}/degree`} />
            </Switch>
        </Suspense>
    )};

export default Categories