import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { GithubProvider } from "./context/context";
import { Auth0Provider } from "@auth0/auth0-react";
// client id hS7NawKxktk3uEXD9h2c3JVXh0ZNoWSB
// domain dev-qzn9jrzs.us.auth0.com

ReactDOM.render(
	<React.StrictMode>
		<Auth0Provider
			domain="dev-qzn9jrzs.us.auth0.com"
			clientId="hS7NawKxktk3uEXD9h2c3JVXh0ZNoWSB"
			redirectUri={window.location.origin}
			cacheLocation="localstorage"
		>
			<GithubProvider>
				<App />
			</GithubProvider>
		</Auth0Provider>
	</React.StrictMode>,
	document.getElementById("root")
);
