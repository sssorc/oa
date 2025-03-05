import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const BASE_URL = '//api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx';

export const devig = async (params) => {
	const url = `${BASE_URL}?api=open&Args=ev_p,fb_p,fo_o,kelly,dm&${params}`;

	try {
		const response = await axios.get(url);

		if ('message' in response.data) {
			throw new Error(response.data.message);
		}

		return response.data;
	} catch (error) {
		if ('message' in error) {
			throw new Error(error.message);
		}
		throw new Error('Error devigging. Re-check inputs.');
	}
};
