import { useRadio, useRadioGroup, HStack, Box } from '@chakra-ui/react';

// https://chakra-ui.com/docs/components/radio#:~:text=Custom%20Radio%20Buttons%23
export default function RadioCard(props: any) {
	const { getInputProps, getRadioProps } = useRadio(props);

	const input = getInputProps();
	const checkbox = getRadioProps();

	return (
		<Box as="label">
			<input {...input} />
			<Box
				{...checkbox}
				cursor="pointer"
				borderWidth="1px"
				borderRadius="md"
				boxShadow="md"
				_checked={{
					bg: 'teal.600',
					color: 'white',
					borderColor: 'teal.600',
				}}
				_focus={{
					boxShadow: 'outline',
				}}
				px={5}
				py={3}
			>
				{props.children}
			</Box>
		</Box>
	);
}
