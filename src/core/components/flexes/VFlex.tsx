'use client';
import { Flex, FlexProps } from '@chakra-ui/react';
import * as React from 'react';

export interface IVFlexProps extends FlexProps {}

export function VFlex({ children, className, sx, ...rest }: IVFlexProps) {
	return (
		<Flex
			className={'VFlex ' + (className || '')}
			sx={{
				width: '100%',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				...sx,
			}}
			{...rest}
		>
			{children}
		</Flex>
	);
}
