import React from "react";
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from "./pages";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
	return (
		<AuthWrapper>
			<Router>
				{/* switch renders the first child that matches */}
				<Switch>
					<PrivateRoute path="/" exact>
						<Dashboard></Dashboard>
					</PrivateRoute>
					<Route path="/login">
						<Login />
					</Route>
					{/* always it navigates to something different, goes to error page */}
					<Route path="*">
						<Error />
					</Route>
				</Switch>
			</Router>
		</AuthWrapper>
	);
}

export default App;
