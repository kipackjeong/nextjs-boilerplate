'use client';
import { HFlex } from '@/core/Flex/HFlex';
import { VFlex } from '@/core/Flex/VFlex';
import { Icon, IconButton, Input, Select, Text } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import CompanyRadioSelection from '@/lib/components/CompanyRadioSelection';
import { useConversationChat } from '@/app/dev/live-interview/useConversationChat';
import { RecognitionStatus, useSpeechAI } from '../core/SpeechAI/useSpeechAI';
import { FaMicrophone } from 'react-icons/fa';

// TODO: implement code editor.
// https://www.freecodecamp.org/news/how-to-build-react-based-code-editor/
export function CodePanel(props: {}) {
	const [code, setCode] = useState('//place your code below\n');

	return (
		<VFlex sx={{ position: 'relevant' }}>
			<textarea
				style={{
					position: 'absolute',
					backgroundColor: '#000',
					opacity: 0,
					width: 500,
					height: 500,
				}}
				className="editor"
				onChange={(e) => {
					setCode(e.target.value);
				}}
				value={code}
			></textarea>
		</VFlex>
	);
}

export enum Language {
	English = 'en-US',
	Korean = 'ko-KR',
}
export interface IInterviewPanelProps {}
export function InterviewPanel(props: IInterviewPanelProps) {
	const [userInput, setUserInput] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [company, setCompany] = useState('Google');
	const [conversations, setConversations] = useState<string[]>([]);
	const [language, setLanguage] = useState(Language.English);
	const {
		startMicWithOnceRecognition,
		startMicWithContinuousRecognition,
		stopRecognition,
		synthesizeSpeech,
		status,
	} = useSpeechAI({
		onSpeechResult: (result) => {
			setUserInput(result);
			setSubmitted(true);
		},
		language,
	});

	const template = useMemo(
		() =>
			`You are impersonating a ${company} senior software engineer that will conduct job interview with candidate. You can name yourself randomly. Also there are high level steps in the interview process. First introduction and ask about past experience, then ask about technical questions, then ask about behavioral questions, then ask about questions from candidate.`,
		[company]
	);

	const { answer } = useConversationChat({
		userInput,
		submitted,
		template,
	});

	// triggers when user submits the input
	useEffect(() => {
		if (submitted) {
			setUserInput('');
			setConversations((prev) => [...prev, userInput]);
			setSubmitted(false);
		}
	}, [answer, submitted, userInput]);

	// whenever chatbot answers, add it to the list of answers
	useEffect(() => {
		if (answer) {
			setConversations((prev) => [...prev, answer]);
			synthesizeSpeech(answer);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [answer]);

	useEffect(() => {
		setConversations([]);
	}, [company]);

	return (
		<VFlex
			className="InterviewPanel"
			sx={{
				mt: 2,
				px: 2,
				width: '100%',
				maxWidth: 1200,
				height: 760,
				justifyContent: 'flex-start',
				alignItems: 'center',
				gap: 6,
			}}
		>
			<Text>Live Interview</Text>
			<HFlex sx={{ width: 200 }}>
				<Select
					variant="outline"
					defaultValue={Language.English}
					onChange={(e) => {
						setLanguage(e.target.value as Language);
					}}
				>
					<option value={Language.English}>English</option>
					<option value={Language.Korean}>Korean</option>
				</Select>
			</HFlex>

			<CompanyRadioSelection
				onSelect={(company) => {
					setCompany(company);
				}}
			/>
			<VFlex
				sx={{
					height: '100%',
					width: '100%',
					justifyContent: 'flex-start',
					overflowY: 'auto',
				}}
			>
				{conversations.map((conversation, idx) => {
					return (
						<HFlex
							key={'conv-' + idx}
							sx={{
								width: '100%',
								justifyContent:
									idx % 2 === 0 ? 'left' : 'right',
							}}
						>
							<Text sx={{ maxWidth: 500 }}>{conversation}</Text>
						</HFlex>
					);
				})}
			</VFlex>
			<form
				style={{
					width: '100%',
				}}
				onSubmit={(e) => {
					e.preventDefault();
					setSubmitted(true);
				}}
			>
				<HFlex>
					<Input
						sx={{ width: '100%' }}
						placeholder=""
						value={userInput}
						onChange={(e) => setUserInput(e.target.value)}
					/>
					<IconButton
						aria-label={'recording-btn'}
						colorScheme="primary"
						onClick={() => {
							console.log(status);
							if (status === RecognitionStatus.stopped) {
								startMicWithContinuousRecognition();
							} else {
								stopRecognition();
							}
						}}
					>
						<Icon as={FaMicrophone} />
					</IconButton>
				</HFlex>
			</form>
			{/* <CodePanel /> */}
		</VFlex>
	);
}
