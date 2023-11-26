import RadioCard from '@/core/Form/RadioCard';
import { useRadioGroup, HStack } from '@chakra-ui/react';
import { useState } from 'react';

export default function CompanyRadioSelection({
	onSelect,
}: {
	onSelect: (company: string) => void;
}) {
	const options = ['Google', 'Microsoft', 'Facebook'];
	const [selectedValue, setSelectedValue] = useState('Google');

	const { getRootProps, getRadioProps } = useRadioGroup({
		name: 'company',
		defaultValue: 'Google',
		onChange: onSelect,
	});

	const group = getRootProps();

	return (
		<HStack {...group}>
			{options.map((value) => {
				const radio = getRadioProps({ value });
				return (
					<RadioCard key={value} {...radio}>
						{value}
					</RadioCard>
				);
			})}
		</HStack>
	);
}
