'use client';
import { Flex, FlexProps } from '@chakra-ui/react';
import * as React from 'react';

export interface IHFlexProps extends FlexProps {}

export function HFlex({ children, sx, className, ...rest }: IHFlexProps) {
	return (
		<Flex
			className={'HFlex ' + (className || '')}
			sx={{
				width: '100%',
				flexDirection: 'row',
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
