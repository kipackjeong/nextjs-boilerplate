import { useEffect, useMemo, useState } from 'react';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatPromptTemplate, MessagesPlaceholder } from 'langchain/prompts';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';

// https://js.langchain.com/docs/get_started/quickstart#prompt-templates

export enum Language {
	English = 'English',
	Chinese = 'Chinese',
}

export interface TemplateVariables extends Record<string, string> {}

export function useConversationChat({
	userInput,
	submitted,
	template,
}: {
	userInput: string;
	submitted: boolean;
	template: string;
}) {
	const [_answer, _setAnswer] = useState('');

	const {
		model: _model,
		template: _template,
		chain: _chain,
	} = useMemo(() => {
		const model = new ChatOpenAI({
			temperature: 0.4,
			openAIApiKey: process.env.openAIApiKey,
		});

		const humanTemplate = '{input}';

		const chatPrompt = ChatPromptTemplate.fromMessages([
			['system', template],
			new MessagesPlaceholder('history'),
			['human', humanTemplate],
		]);

		const conversationChain = new ConversationChain({
			llm: model,
			prompt: chatPrompt,
			memory: new BufferMemory({
				returnMessages: true,
				memoryKey: 'history',
			}),
		});

		return { model, template, chain: conversationChain };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [template]);

	const _templateVariables = useMemo(
		() => ({
			input: userInput,
		}),
		[userInput]
	);

	useEffect(() => {
		if (submitted) {
			_chain
				.call({
					..._templateVariables,
				})
				.then((result: any) => {
					_setAnswer(result.response);
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submitted]);

	return { answer: _answer };
}
