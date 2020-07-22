import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

// create context
const GithubContext = React.createContext();

// it results in two components
// provider, consumer - githubContext.Provider

const GithubProvider = ({ children }) => {
	const [githubUser, setGithubUser] = useState({});
	const [repos, setRepos] = useState({});
	const [followers, setFollowers] = useState({});

	// request loading
	const [requests, setRequests] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	// error
	const [error, setError] = useState({ show: false, msg: "" });

	// search user
	const searchGithubUser = async (user) => {
		toggleError(false, "");
		setIsLoading(true);

		const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
			console.log(err)
		);
		if (response) {
			setGithubUser(response.data);
			const { login, followers_url } = response.data;

			// axios(
			// 	`${rootUrl}/users/${login}/repos?per_page=100`
			// ).then((response) => setRepos(response.data));
			// axios(`${followers_url}`).then((response) =>
			// 	setFollowers(response.data)
			// );

			await Promise.allSettled([
				axios(`${rootUrl}/users/${login}/repos?per_page=100`),
				axios(`${followers_url}`),
			]).then((results) => {
				// console.log(results);
				const [repos, followers] = results;
				const status = "fulfilled";
				if (repos.status === status) {
					setRepos(repos.value.data);
				}
				if (followers.status === status) {
					setFollowers(followers.value.data);
				}
			});
		} else {
			toggleError(true, "there is no user with that username!");
		}
		checkRequests();
		setIsLoading(false);
	};

	// check rate

	const checkRequests = () => {
		axios(`${rootUrl}/rate_limit`)
			.then(({ data }) => {
				let {
					rate: { remaining },
				} = data;

				setRequests(remaining);
				if (remaining === 0) {
					// throw an error
					toggleError(
						true,
						"sorry you have exceeded your hourly rate limit!"
					);
				}
			})
			.catch((err) => console.log(err));
	};

	function toggleError(show = false, msg = "") {
		setError({ show, msg });
	}

	useEffect(checkRequests, []);

	return (
		<GithubContext.Provider
			value={{
				githubUser,
				repos,
				followers,
				requests,
				error,
				searchGithubUser,
				isLoading,
			}}
		>
			{children}
		</GithubContext.Provider>
	);
};

export { GithubProvider, GithubContext };
