'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import React, { PropsWithChildren } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import store from '@lib/redux/stores/app.store';
import theme from '@themes';

export default function Providers({ children }: PropsWithChildren) {
	return (
		<CacheProvider>
			<ChakraProvider theme={theme}>
				<DndProvider backend={HTML5Backend}>
					<Provider store={store}>{children}</Provider>
				</DndProvider>
			</ChakraProvider>
		</CacheProvider>
	);
}
