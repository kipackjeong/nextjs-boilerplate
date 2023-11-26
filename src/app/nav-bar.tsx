'use client';
import {
	Box,
	Flex,
	Avatar,
	HStack,
	IconButton,
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuDivider,
	useDisclosure,
	useColorModeValue,
	Stack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { HFlex } from '@/core/Flex/HFlex';
import link from 'next/link';

const Links = ['Projects', 'Dev'];

interface Props {
	children: React.ReactNode;
	path: string;
}
const NavLink = ({ children, path }: Props) => {
	return (
		<Box
			as="a"
			px={2}
			py={1}
			rounded={'md'}
			_hover={{
				textDecoration: 'none',
				bg: useColorModeValue('gray.200', 'gray.700'),
			}}
			href={'/' + path.toLowerCase()}
		>
			{children}
		</Box>
	);
};

export default function Navbar() {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<nav style={{ position: 'sticky' }}>
			<Box px={4} className="nav-bar">
				<HFlex
					className="nav-bar__menus"
					sx={{
						h: 16,
						justifyContent: 'center',
						alignItems: 'center',
						gap: 4,
					}}
				>
					<IconButton
						size={'md'}
						icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
						aria-label={'Open Menu'}
						display={{ md: 'none' }}
						onClick={isOpen ? onClose : onOpen}
					/>
					<HStack spacing={8} alignItems={'center'}>
						<Box>Logo</Box>
						<HStack
							as={'nav'}
							spacing={4}
							display={{ base: 'none', md: 'flex' }}
						>
							{Links.map((link) => (
								<NavLink key={link} path={link}>
									{link}
								</NavLink>
							))}
						</HStack>
					</HStack>
					<Flex alignItems={'center'}>
						<Menu>
							<MenuButton
								as={Button}
								rounded={'full'}
								variant={'link'}
								cursor={'pointer'}
								minW={0}
							>
								<Avatar
									size={'sm'}
									src={
										'https://images.unsplash.com/photo-1522196772883-393d879eb14d?q=80&w=1285&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
									}
								/>
							</MenuButton>
							<MenuList>
								<MenuItem>Link 1</MenuItem>
								<MenuItem>Link 2</MenuItem>
								<MenuDivider />
								<MenuItem>Link 3</MenuItem>
							</MenuList>
						</Menu>
					</Flex>
				</HFlex>

				{isOpen ? (
					<Box pb={4} display={{ md: 'none' }}>
						<Stack as={'nav'} spacing={4}>
							{Links.map((link) => (
								<NavLink key={link} path={link}>
									{link}
								</NavLink>
							))}
						</Stack>
					</Box>
				) : null}
			</Box>
		</nav>
	);
}
