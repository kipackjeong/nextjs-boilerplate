'use client';

import {
	useDisclosure,
	useColorModeValue,
	Flex,
	Text,
	BoxProps,
} from '@chakra-ui/react';
import AppColorPanel from '@core/components/AppColorPanel';
import React from 'react';
import { IconType } from 'react-icons';
import { FaUser } from 'react-icons/fa';
import { FiHome } from 'react-icons/fi';
import { useAppStatus } from '../../hooks/useAppStatus';
import NavItem from './NavItem';

const SideBar = () => {
	const { isOnline } = useAppStatus();

	const linkItems: Array<any> = [
		{ name: 'Home', icon: FiHome, link: '/' },
		isOnline
			? { name: 'Logout', icon: FaUser, link: '/logout' }
			: { name: 'Login', icon: FaUser, link: '/login' },
		// {
		//   name: "Daily",
		//   icon: MdCalendarToday,
		//   link: `/dailyboard`,
		// },
	];

	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<Flex
				className="sidebar"
				sx={{
					p: '32px 32px 32px 32px',
					height: '100%',
					flexDir: 'column',
					justifyContent: 'flex-start',
					w: { base: '100px', md: '200px' },
					color: 'brand.heavy',
					borderRight: '1px',
					borderRightColor: useColorModeValue('gray.200', 'gray.700'),
					gap: 32,
				}}
			>
				<Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
					Logo
				</Text>
				<SidebarContent
					linkItems={linkItems}
					onClose={() => onClose}
					display={{ base: 'flex', md: 'flex' }}
				/>
			</Flex>

			{/* mobilenav */}
			{/* <Flex>
				<Drawer
					autoFocus={false}
					isOpen={isOpen}
					placement="left"
					onClose={onClose}
					returnFocusOnClose={false}
					onOverlayClick={onClose}
					size="xs"
				>
					<DrawerContent className="side-bar-drawer-content">
						<SidebarContent
							linkItems={linkItems}
							onClose={onClose}
						/>
						<DrawerCloseButton zIndex={1} onClick={onClose} />
					</DrawerContent>
				</Drawer>

				<MobileNav
					display={{ base: 'flex', md: 'none' }}
					onOpen={onOpen}
				/>
			</Flex> */}
		</>
	);
};

export interface LinkItemProps {
	name: string;
	icon: IconType;
	link: string;
}
interface SidebarProps extends BoxProps {
	linkItems: any;
	onClose: () => void;
}

const SidebarContent = ({ linkItems, onClose }: SidebarProps) => {
	return (
		<Flex
			className="sidebar-content"
			bg={useColorModeValue('white', 'gray.900')}
			w={{ base: '50%', sm: '80%', md: '100%' }}
			pos="relative"
			m={{ base: 'none', md: 'auto' }}
			flexDir={'column'}
			justifyContent={'flex-start'}
			alignItems="flex-start"
		>
			<Flex
				h="20"
				alignItems="center"
				mx="8"
				justifyContent="space-between"
			></Flex>
			{linkItems.map((link: any) => (
				<NavItem key={link.name} link={link} />
			))}
			<AppColorPanel />
		</Flex>
	);
};

export default SideBar;
