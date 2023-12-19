import { Button } from '@chakra-ui/button';
import { FormControl, FormErrorMessage } from '@chakra-ui/form-control';
import { InputGroup, InputLeftElement, Input } from '@chakra-ui/input';
import { Flex, Stack, Heading, Box } from '@chakra-ui/layout';
import { chakra } from '@chakra-ui/system';
import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';
import { useState, useRef, useEffect, FormEvent } from 'react';
import { FaUserAlt, FaLock, FaMailBulk } from 'react-icons/fa';

const SignupPage = () => {
	const CFaUserAlt = chakra(FaUserAlt);
	const CFaLock = chakra(FaLock);
	const CFaEmail = chakra(FaMailBulk);
	const router = Router;

	const [showPassword, setShowPassword] = useState(false);
	const [isValid, setIsValid] = useState(true);
	const [isPasswordMatching, setIsPasswordMatching] = useState(true);

	useEffect(() => {
		if (!isPasswordMatching)
			setInvalidMsg(
				'The reentered password does not match with the initial password.'
			);
	}, [isPasswordMatching]);

	const [invalidMsg, setInvalidMsg] = useState('');

	const fNameRef = useRef(null);
	const lNameRef = useRef(null);
	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	async function onSubmitHandler(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const firstname = (fNameRef!.current! as HTMLInputElement).value;
		const lastname = (lNameRef!.current! as HTMLInputElement).value;
		const email = (emailRef!.current! as HTMLInputElement).value;
		const password = (passwordRef!.current! as HTMLInputElement).value;
		// call api.

		let user;
		try {
			user = await axios.post(process.env.apiurl + '/signup', {
				firstname,
				lastname,
				email,
				password,
			});

			router.push('/login');
		} catch (error: any) {
			const msg = error.response.data.message;

			setInvalidMsg(msg);
			setIsValid(false);
		}
	}

	return (
		<Flex
			flexDirection="column"
			width="100%"
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
							<FormControl
								justifyContent="center"
								isInvalid={true}
							>
								<FormErrorMessage justifyContent="center">
									{invalidMsg}
								</FormErrorMessage>
							</FormControl>
							{/* firstname */}
							<FormControl isRequired isInvalid={!isValid}>
								<InputGroup>
									<InputLeftElement pointerEvents="none">
										<CFaUserAlt color="gray.300" />
									</InputLeftElement>
									<Input
										ref={fNameRef}
										type="text"
										placeholder="firstname"
									/>
								</InputGroup>
							</FormControl>

							{/* lastname */}
							<FormControl isRequired isInvalid={!isValid}>
								<InputGroup>
									<InputLeftElement pointerEvents="none">
										<CFaUserAlt color="gray.300" />
									</InputLeftElement>
									<Input
										ref={lNameRef}
										type="text"
										placeholder="last name"
									/>
								</InputGroup>
							</FormControl>

							{/* email */}
							<FormControl isRequired isInvalid={!isValid}>
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

							{/* pw */}

							<FormControl
								isRequired
								isInvalid={!isPasswordMatching}
							>
								<InputGroup>
									<InputLeftElement
										pointerEvents="none"
										color="gray.300"
									>
										<CFaLock color="gray.300" />
									</InputLeftElement>
									<Input
										ref={passwordRef}
										type={'password'}
										placeholder="password"
									/>
								</InputGroup>
							</FormControl>

							{/* Re-enter password */}
							<FormControl
								isRequired
								isInvalid={!isPasswordMatching}
							>
								<InputGroup>
									<InputLeftElement
										pointerEvents="none"
										color="gray.300"
									>
										<CFaLock color="gray.300" />
									</InputLeftElement>
									<Input
										type={'password'}
										placeholder="reenter password"
										onChange={(e) => {
											const firstPW = (
												passwordRef.current! as HTMLInputElement
											).value;
											const secondPW = e.target.value;
											if (
												firstPW.substring(
													0,
													secondPW.length
												) != secondPW
											) {
												setIsPasswordMatching(false);
											} else {
												setIsPasswordMatching(true);
											}
										}}
									/>
								</InputGroup>
							</FormControl>

							{/* Button */}
							<Button
								borderRadius={0}
								type="submit"
								variant="solid"
								backgroundColor={'brand.heavy'}
								_hover={{ backgroundColor: 'brand.blue.200' }}
								width="full"
							>
								Sign up
							</Button>
						</Stack>
					</form>
				</Box>
			</Stack>
			<Box>
				Back to login?{' '}
				<Link color="teal.500" href="/login">
					Login
				</Link>
			</Box>
		</Flex>
	);
};

export default SignupPage;
