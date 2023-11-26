import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET(request: Request, response: Response) {
	const cookie = cookies().get('speechToken');

	if (cookie) {
		console.log('cookie exists in server');
		return Response.json(cookie?.value, {
			headers: {
				'content-type': 'text/plain',
			},
		});
	} else {
		console.log('cookie does not exists in server');

		const speechKey = process.env.azureSpeechAIKey;
		const speechRegion = 'westus';
		const headers = {
			headers: {
				'Ocp-Apim-Subscription-Key': speechKey,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		};
		const tokenResponse = await axios.post(
			`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
			null,
			headers
		);
		const data = speechRegion + ':' + tokenResponse.data;
		cookies().set('speechToken', data, { maxAge: 540 });
		return Response.json(data);
	}
}
