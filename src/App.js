import React, { useState, useEffect } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

import { getPlacesData, getWeatherData } from './api/index';

function App() {
	const [places, setPlaces] = useState([]);
	const [filteredPlaces, setFilteredPlaces] = useState([]);
	const [coordinates, setCoordinates] = useState({});
	const [bounds, setBounds] = useState({});
	const [childClicked, setChildClicked] = useState(0);
	const [type, setType] = useState('restaurants');
	const [rating, setRating] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [weatherData, setWeatherData] = useState([]);

	console.count();
	useEffect(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			setCoordinates({
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			});
		});
	}, []);

	useEffect(() => {
		const filteredPlaces = places?.filter((place) => place.rating > rating);
		setFilteredPlaces(filteredPlaces);
	}, [rating]);

	useEffect(() => {
		if (
			Object.keys(bounds).length === 0 ||
			Object.keys(coordinates).length === 0
		)
			return;
		let cancel = false;
		setIsLoading(true);

		getWeatherData(coordinates.lat, coordinates.lng).then((data) => {
			setWeatherData(data);
		});

		getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
			if (cancel) return;
			setPlaces(data?.filter((place) => place.name && place.num_review > 0));
			setFilteredPlaces([]);
			setIsLoading(false);
		});

		return () => (cancel = true);
	}, [type, bounds]);

	return (
		<>
			<CssBaseline />
			<Header setCoordinates={setCoordinates} />
			<Grid container spacing={3} styles={{ width: '100%' }}>
				<Grid item xs={12} md={4}>
					<List
						places={filteredPlaces?.length ? filteredPlaces : places}
						childClicked={childClicked}
						isLoading={isLoading}
						type={type}
						setType={setType}
						rating={rating}
						setRating={setRating}
					/>
				</Grid>
				<Grid item xs={12} md={8}>
					<Map
						setCoordinates={setCoordinates}
						setBounds={setBounds}
						coordinates={coordinates}
						places={filteredPlaces.length ? filteredPlaces : places}
						setChildClicked={setChildClicked}
						weatherData={weatherData}
					/>
				</Grid>
			</Grid>
		</>
	);
}

export default App;
