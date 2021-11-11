import type { RequestHandler } from '@sveltejs/kit';
import type { Locals } from '$lib/types';
import { manifesto } from '../manifesto.txt';
import { convertInput } from './leetconvert';

// POST /transleet
export const post: RequestHandler<Locals, FormData> = async (request) => {
	const url = request.body.get('q');

	try {
		const headers = new URL(url).searchParams.getAll('H').map((header) => {
			return header.split('=');
		});

		const headerObj = {};
		headers.forEach((pair) => {
			headerObj[pair[0]] = pair[1];
		});

		const res = await fetch(url, {
			headers: headerObj
		});

		let pageText = await res.text();

		console.log(res.headers.get('content-type'));

		if (res.headers.get('content-type') !== 'application/json') {
			pageText = convertInput(pageText);
		}

		return {
			status: 200,
			body: {
				text: pageText
			}
		};
	} catch (error) {
		console.error(error);

		return {
			status: 200,
			body: {
				text: convertInput(manifesto)
			}
		};
	}
};
