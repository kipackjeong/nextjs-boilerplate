import { Flex } from '@chakra-ui/react';
import { HFlex } from '@core/components/flexes/HFlex';
import { VFlex } from '@core/components/flexes/VFlex';
import React, { PropsWithChildren } from 'react';

const MainLayout = ({ children }: PropsWithChildren) => {
	return (
		<HFlex
			className="main-layout"
			flexDir="row"
			height="100vh"
			width="100vw"
		>
			{children}
		</HFlex>
	);
};

export default MainLayout;
