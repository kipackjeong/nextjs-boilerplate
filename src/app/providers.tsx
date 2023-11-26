'use client';

import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { CacheProvider } from '@chakra-ui/next-js';
import { theme } from './theme';

export interface ProvidersProps {
	children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	return (
		<CacheProvider>
			<ChakraProvider theme={theme}>{children}</ChakraProvider>
		</CacheProvider>
	);
}
