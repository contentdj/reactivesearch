import React, { Component } from 'react';
import {
	ReactiveBase,
	RatingsFilter,
	SelectedFilters,
	ReactiveList,
} from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';

import initReactivesearch from '@appbaseio/reactivesearch/lib/server';

import Layout from '../components/Layout';
import BookCard from '../components/BookCard';

const settings = {
	app: 'good-books-ds',
	credentials: 'nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d',
};

const ratingsFilterProps = {
	componentId: 'BookSensor',
	dataField: 'average_rating',
	data: [
		{ start: 0, end: 3, label: 'Rating < 3' },
		{ start: 3, end: 4, label: 'Rating 3 to 4' },
		{ start: 4, end: 5, label: 'Rating > 4' },
	],
	defaultSelected: {
		start: 4,
		end: 5,
	},
};

const reactiveListProps = {
	componentId: 'SearchResult',
	dataField: 'original_title.raw',
	from: 0,
	size: 10,
	onData: data => (<BookCard key={data._id} data={data} />),
	react: {
		and: ['BookSensor'],
	},
};

export default class Main extends Component {
	static async getInitialProps() {
		return {
			store: await initReactivesearch(
				[
					{
						...ratingsFilterProps,
						type: 'RatingsFilter',
						source: RatingsFilter,
					},
					{
						...reactiveListProps,
						type: 'ReactiveList',
						source: ReactiveList,
					},
				],
				null,
				settings,
			),
		};
	}

	render() {
		return (
			<Layout title="SSR | RatingsFilter">
				<ReactiveBase {...settings} initialState={this.props.store}>
					<div className="row">
						<div className="col">
							<RatingsFilter
								{...ratingsFilterProps}
							/>
						</div>

						<div className="col">
							<SelectedFilters />
							<ReactiveList
								{...reactiveListProps}
							/>
						</div>
					</div>
				</ReactiveBase>
			</Layout>
		);
	}
}

Main.propTypes = {
	// eslint-disable-next-line
	store: PropTypes.object,
};
