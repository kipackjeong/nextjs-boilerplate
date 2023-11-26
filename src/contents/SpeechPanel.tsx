'use client';
import { VFlex } from '@/core/Flex/VFlex';
import { useMemo } from 'react';
import { Icon, IconButton } from '@chakra-ui/react';
import { FaMicrophone } from 'react-icons/fa';
import useAudioRecorder from '@/core/AudioRecorder/useAudioRecorder';
import { useSpeechAI } from '../core/SpeechAI/useSpeechAI';

export function SpeechPanel() {
	const { started, startRecording, stopRecording, cancelRecording } =
		useAudioRecorder();
	const { startMicWithOnceRecognition } = useSpeechAI({
		onSpeechResult: (result: string) => {
			console.log(result);
		},
	});

	return (
		<VFlex>
			<IconButton
				aria-label={'recording-btn'}
				colorScheme="primary"
				onClick={() => {
					startMicWithOnceRecognition();
					// if (started) {
					// 	stopRecording();
					// } else {
					// 	startRecording();
					// }
				}}
			>
				<Icon as={FaMicrophone} />
			</IconButton>
		</VFlex>
	);
}
