'use client';
import { Link } from '@chakra-ui/next-js';
import {
	chakra,
	Flex,
	Stack,
	Heading,
	FormControl,
	FormErrorMessage,
	InputGroup,
	InputLeftElement,
	Input,
	InputRightElement,
	Button,
	FormHelperText,
	Box,
} from '@chakra-ui/react';
import axiosInstance from '@core/utils/axios';
import { useAppStatus } from '@lib/hooks/useAppStatus';
import IUser from '@lib/models/user/user';
import { taskActions } from '@lib/redux/slices/task.slice';
import { userActions } from '@lib/redux/slices/user.slice';
import authLocalService from '@lib/services/auth/auth.local-service';
import { Router } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { FaLock, FaMailBulk } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

function Login() {
	useEffect(() => {
		async function onPageLoad() {
			try {
				await authLocalService.setOnlineStatus(false);
				dispatch(taskActions.deleteAll());
				dispatch(userActions.setUser());
			} catch (error) {
				console.error(error);
			}
		}

		onPageLoad();
	}, []);

	const CFaLock = chakra(FaLock);
	const CFaEmail = chakra(FaMailBulk);

	const [showPassword, setShowPassword] = useState(false);
	const [isValid, setIsValid] = useState(true);

	const emailRef = useRef(null);
	const passwordRef = useRef(null);
	const router = Router;

	const dispatch = useDispatch();

	const { setIsOnline } = useAppStatus();

	function showClickHandler() {
		setShowPassword(!showPassword);
	}

	async function onSubmitHandler(e: any) {
		e.preventDefault();
		const email = (emailRef.current! as HTMLInputElement).value;
		const password = (passwordRef!.current! as HTMLInputElement).value;

		// #region call api to /login
		// TODO: handle cors error.
		try {
			// the cookie will get setted
			setIsOnline(true);
			await authLocalService.setOnlineStatus(true);

			const res = await axiosInstance.post(
				'/login',
				{
					email,
					password,
				},
				{ withCredentials: true }
			);
			console.log(res);

			const user: IUser = res.data.data;

			dispatch(userActions.setUser(user));

			router.push('/home');
		} catch (error) {
			setIsValid(false);
		}
		// #endregion
	}

	async function useLocalClickHandler(e: MouseEvent<HTMLAnchorElement>) {
		setIsOnline(false);
		await authLocalService.setOnlineStatus(false);

		dispatch(
			userActions.setUser({
				_id: '',
				email: '',
				password: '',
				firstname: '',
				lastname: '',
			})
		);
	}

	return (
		<Flex
			flexDirection="column"
			width="100vw"
			height="100vh"
			backgroundColor="brand.lightGray"
			justifyContent="center"
			alignItems="center"
		>
			<Stack
				flexDir="column"
				mb="2"
				justifyContent="center"
				alignItems="center"
			>
				{/* TODO: logo goes here */}
				<Heading color="brand.heavy">Welcome</Heading>
				<Box minW={{ base: '90%', md: '468px' }}>
					<form onSubmit={onSubmitHandler}>
						<Stack
							spacing={4}
							p="2rem"
							backgroundColor="whiteAlpha.900"
							boxShadow="md"
						>
							{/* email */}
							<FormControl isRequired isInvalid={!isValid}>
								<FormErrorMessage>
									The user with given email and password does
									not exist.
								</FormErrorMessage>

								<InputGroup>
									<InputLeftElement pointerEvents="none">
										<CFaEmail color="gray.300" />
									</InputLeftElement>
									<Input
										ref={emailRef}
										type="email"
										placeholder="email address"
									/>
								</InputGroup>
							</FormControl>
							{/* email */}
							<FormControl isRequired isInvalid={!isValid}>
								<InputGroup>
									<InputLeftElement
										pointerEvents="none"
										color="gray.300"
									>
										<CFaLock color="gray.300" />
									</InputLeftElement>
									<Input
										ref={passwordRef}
										type={
											showPassword ? 'text' : 'password'
										}
										placeholder="Password"
									/>
									<InputRightElement width="4.5rem">
										<Button
											h="1.75rem"
											size="sm"
											onClick={showClickHandler}
										>
											{showPassword ? 'Hide' : 'Show'}
										</Button>
									</InputRightElement>
								</InputGroup>
								<FormHelperText textAlign="right">
									<Link href={''}>forgot password?</Link>
								</FormHelperText>
							</FormControl>
							<Button
								borderRadius={0}
								type="submit"
								variant="solid"
								backgroundColor={'brand.heavy'}
								_hover={{ backgroundColor: 'brand.blue.200' }}
								width="full"
							>
								Login
							</Button>
						</Stack>
					</form>
				</Box>
			</Stack>
			<Box>
				New to us?{' '}
				<Link color="teal.500" href="/signup">
					Sign Up
				</Link>
			</Box>
			<Box>
				<Link
					color="teal.500"
					onClick={useLocalClickHandler}
					href={'/'}
				>
					Use local
				</Link>
			</Box>
		</Flex>
	);
}

export default Login;
