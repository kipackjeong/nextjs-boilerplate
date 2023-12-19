import { Box, ChakraProps, useRadio, UseRadioProps } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

// 1. Create a component that consumes the `useRadio` hook

type RadioCardProps = ChakraProps & PropsWithChildren & UseRadioProps;
const RadioCard = (props: RadioCardProps) => {
	const { getInputProps, getCheckboxProps } = useRadio(props);

	const input = getInputProps();
	const checkbox = getCheckboxProps();

	return (
		<Box as="label">
			<input {...input} />
			<Box
				{...props}
				{...checkbox}
				cursor="pointer"
				borderWidth="1px"
				borderRadius="md"
				boxShadow="md"
				px={5}
			>
				{props.children}
			</Box>
		</Box>
	);
};

export default RadioCard;
