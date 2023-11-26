'use client';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { useCallback, useEffect, useState } from 'react';

export enum RecognitionStatus {
	running,
	stopped,
}
//TODO:https://github.com/Azure-Samples/AzureSpeechReactSample
export function useSpeechAI({
	onSpeechResult,
	language,
}: {
	onSpeechResult: (result: string) => void;
	textToSynthesize?: string;
	language?: string;
}): {
	startMicWithOnceRecognition: () => void;
	startMicWithContinuousRecognition: () => void;
	stopRecognition: () => void;
	synthesizeSpeech: (textToSynthesize: string) => void;
	status: RecognitionStatus | null;
} {
	const [status, setStatus] = useState<RecognitionStatus | null>(
		RecognitionStatus.stopped
	);

	const [recognizer, setRecognizer] =
		useState<SpeechSDK.SpeechRecognizer | null>();
	const [synthesizer, setSynthesizer] =
		useState<SpeechSDK.SpeechSynthesizer | null>(null);
	const [recognizedSpeechText, setRecognizedSpeechText] =
		useState<string>('');

	useEffect(() => {
		console.log('initializing the speech recognizer instance...');
		_initSpeechRecognizer().then(([recognizer, synthesizer]) => {
			console.log('speech recognizer initilized.');
			setRecognizer(recognizer);
			setSynthesizer(synthesizer);
		});
		return () => {
			recognizer?.close();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [language]);

	async function _initSpeechRecognizer(): Promise<
		[SpeechSDK.SpeechRecognizer, SpeechSDK.SpeechSynthesizer]
	> {
		const tokenObj = await getTokenOrRefresh();
		const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(
			tokenObj?.authToken,
			tokenObj?.region
		);

		speechConfig.speechRecognitionLanguage = language || 'en-US';
		speechConfig.speechSynthesisLanguage = language || 'en-US';

		const recognizerAudioConfig =
			SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

		const synthesizerAudioConfig =
			SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();

		const recognizer = new SpeechSDK.SpeechRecognizer(
			speechConfig,
			recognizerAudioConfig
		);
		const synthesizer = new SpeechSDK.SpeechSynthesizer(
			speechConfig,
			synthesizerAudioConfig
		);

		return [recognizer, synthesizer];
	}

	async function startMicWithOnceRecognition() {
		if (!recognizer) {
			return;
		}
		recognizer.recognizeOnceAsync((result) => {
			if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
				onSpeechResult(result.text);
			} else {
				console.log(
					'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.'
				);
			}
		});
	}

	const stopRecognition = useCallback(async () => {
		if (!recognizer) {
			return;
		}

		onSpeechResult(recognizedSpeechText);
		setRecognizedSpeechText('');

		recognizer.stopContinuousRecognitionAsync(
			() => {
				setStatus(RecognitionStatus.stopped);
			},
			(err) => {
				console.error(
					'There was an error stopping the recognition:',
					err
				);
			}
		);
	}, [recognizer, onSpeechResult, recognizedSpeechText]);

	async function startMicWithContinuousRecognition() {
		if (!recognizer) {
			return;
		}

		recognizer.recognizing = (s, e) => {
			console.log(`RECOGNIZING: Text=${e.result.text}`);
		};

		recognizer.recognized = (s, e) => {
			if (e.result.reason == SpeechSDK.ResultReason.RecognizedSpeech) {
				console.log(`RECOGNIZED: Text=${e.result.text}`);
				setRecognizedSpeechText((prev) => (prev += e.result.text));
			} else if (e.result.reason == SpeechSDK.ResultReason.NoMatch) {
				console.log('NOMATCH: Speech could not be recognized.');
			}
		};

		recognizer.canceled = (s, e) => {
			console.log(`CANCELED: Reason=${e.reason}`);

			if (e.reason == SpeechSDK.CancellationReason.Error) {
				console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
				console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
				console.log(
					'CANCELED: Did you set the speech resource key and region values?'
				);
			}
			setStatus(RecognitionStatus.stopped);
			recognizer.stopContinuousRecognitionAsync();
		};

		recognizer.sessionStopped = (s, e) => {
			console.log('STOPPED: continous recognition session stopped.');
			setStatus(RecognitionStatus.stopped);
			recognizer.stopContinuousRecognitionAsync();
		};

		recognizer.startContinuousRecognitionAsync();
		setStatus(RecognitionStatus.running);
	}

	async function synthesizeSpeech(textToSynthesize: string) {
		if (!synthesizer) {
			return;
		}

		synthesizer.speakTextAsync(
			textToSynthesize,
			(result) => {
				if (result) {
					// synthesizer.close();
					return result.audioData;
				}
			},
			(error) => {
				console.log(error);
				synthesizer.close();
			}
		);
	}

	return {
		startMicWithOnceRecognition,
		startMicWithContinuousRecognition,
		stopRecognition,
		synthesizeSpeech,
		status,
	};
}

//API to handle audio recording
export async function getTokenOrRefresh() {
	try {
		const res = await fetch('/api/az-ai-service-token');
		const data = await res.json();
		const token = data.split(':')[1];
		const region = data.split(':')[0];

		return { authToken: token, region: region };
	} catch (err: any) {
		return { authToken: null, error: err.response.data };
	}
}
