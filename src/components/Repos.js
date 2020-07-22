import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";

const Repos = () => {
	const { repos } = React.useContext(GithubContext);
	if (repos.length > 0) {
		let languages = repos.reduce((total, item) => {
			const { language, stargazers_count } = item;

			// if there is no language (null) - returns total without modifications
			if (!language) return total;

			// if there is a language and it is not inside total, defines its value by one
			if (!total[language]) {
				total[language] = {
					label: language,
					value: 1,
					stars: stargazers_count,
				};
			} else {
				// if the language is already inside total, increments it by one
				total[language] = {
					...total[language],
					value: total[language].value + 1,
					stars: total[language].stars + stargazers_count,
				};
			}

			return total;
		}, {});

		// highest language first
		const mostUsed = Object.values(languages)
			.sort((a, b) => {
				return b.value - a.value;
			})
			.slice(0, 5);
		// slice for most 5 popular languages

		console.log(mostUsed);

		// most stars per language
		const mostPopular = Object.values(languages)
			.sort((a, b) => {
				return b.stars - a.stars;
			})
			.map((item) => {
				return { ...item, value: item.stars };
			}); // since the chart reads the value of 'value' -> change it for the stars values

		// stars, forks
		let i = 0;
		let { stars, forks } = repos.reduce(
			(total, item) => {
				const { stargazers_count, name, forks } = item;

				// index will be the same value of stargazers_count and forks
				total.stars[i] = {
					label: name,
					value: stargazers_count,
				};

				total.forks[i] = { label: name, value: forks };
				i++;
				return total;
			},
			{
				stars: {},
				forks: {},
			}
		);

		// it is an ascending order

		// takes the five last repos and reverse the order -> descending order
		stars = Object.values(stars)
			.sort((a, b) => {
				return b.value - a.value;
			})
			.slice(0, 5);
		forks = Object.values(forks)
			.sort((a, b) => {
				return b.value - a.value;
			})
			.slice(0, 5);

		return (
			<section className="section">
				<Wrapper className="section-center">
					{/* <ExampleChart data={chartData} /> */}
					<Pie3D data={mostUsed} />
					<Column3D data={stars} />
					<Doughnut2D data={mostPopular} />
					<Bar3D data={forks} />
				</Wrapper>
			</section>
		);
	} else {
		return (
			<section className="section">
				<Wrapper></Wrapper>
			</section>
		);
	}
};

const Wrapper = styled.div`
	display: grid;
	justify-items: center;
	gap: 2rem;
	@media (min-width: 800px) {
		grid-template-columns: 1fr 1fr;
	}

	@media (min-width: 1200px) {
		grid-template-columns: 2fr 3fr;
	}

	div {
		width: 100% !important;
	}
	.fusioncharts-container {
		width: 100% !important;
	}
	svg {
		width: 100% !important;
		border-radius: var(--radius) !important;
	}
`;

export default Repos;
