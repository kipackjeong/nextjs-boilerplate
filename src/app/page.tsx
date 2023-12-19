'use client';
import { Flex, Card, CardBody, chakra, Divider } from '@chakra-ui/react';
import React from 'react';
import { FiHome } from 'react-icons/fi';
import ModalLayout from '@core/layouts/ModalLayout';
import PageLayout from '@core/layouts/PageLayout';
import Auth from '@lib/components/Auth';
import DailyBoard from '@lib/components/Dailyboard';
import DashBoard from '@lib/components/Dashboard';
import useMediaSize from '@lib/hooks/useMediaSize';
import Providers from './providers';

function HomePage() {
	const HomeIcon = chakra(FiHome);
	const { isSM } = useMediaSize();
	return (
		<Providers>
			<Auth>
				<PageLayout>
					<HomeIcon size={20} />
					<Divider my={2} />
					<Flex
						style={{ width: '100%', height: '100%' }}
						flexDirection={'row'}
						overflowX="hidden"
						overflowY="hidden"
					>
						<Flex w="100%" h="100%">
							<Flex flex={1}>
								<DashBoard />
							</Flex>

							<Flex
								flex={1}
								flexDir={'column'}
								ml={{ base: 5, sm: 0 }}
							>
								{isSM ? (
									<ModalLayout
										onClose={function (): void {
											throw new Error(
												'Function not implemented.'
											);
										}}
									>
										<Card
											w="100%"
											h={{
												base: '100%',
												sm: '800px',
											}}
										>
											<CardBody p={0}>
												<DailyBoard isMini={true} />
											</CardBody>
										</Card>
									</ModalLayout>
								) : (
									<Card
										w="100%"
										h={{ base: '100%', sm: '61em' }}
									>
										<CardBody p={0}>
											<DailyBoard isMini={true} />
										</CardBody>
									</Card>
								)}
							</Flex>
						</Flex>
					</Flex>
				</PageLayout>

				{/* <PageLayout>
        <DailyBoard />
      </PageLayout> */}
			</Auth>
		</Providers>
	);
}

export default HomePage;
