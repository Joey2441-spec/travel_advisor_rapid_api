import axios from 'axios';

let cancelToken;

export const getPlacesData = async (type, sw, ne) => {
	if (typeof cancelToken != typeof undefined) {
		cancelToken.cancel('Operation canceled due to new request');
	}

	cancelToken = axios.CancelToken.source();

	try {
		const {
			data: { data },
		} = await axios.get(
			`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`,
			{
				params: {
					bl_latitude: sw.lat,
					tr_latitude: ne.lat,
					bl_longitude: sw.lng,
					tr_longitude: ne.lng,
				},
				headers: {
					'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
					'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
				},
				cancelToken: cancelToken.token,
			}
		);
		return data;
	} catch (err) {
		if (err.name === 'CanceledError') {
			return;
		}
		console.log(err);
	}
};

export const getWeatherData = async (lat, lng) => {
	try {
		const { data } = await axios.get(
			'https://community-open-weather-map.p.rapidapi.com/find',
			{
				params: { lat, lon: lng },
				headers: {
					'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
					'X-RapidAPI-Host': 'community-open-weather-map.p.rapidapi.com',
				},
			}
		);
		console.log(data);
		return data;
	} catch (err) {
		console.log(err.message);
	}
};
