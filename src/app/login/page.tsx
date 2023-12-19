import { MouseEvent, useEffect, useRef, useState } from 'react';
import {
	Flex,
	Heading,
	Input,
	Button,
	InputGroup,
	Stack,
	InputLeftElement,
	chakra,
	Box,
	Link,
	FormControl,
	FormHelperText,
	InputRightElement,
	FormErrorMessage,
} from '@chakra-ui/react';
import { FaUserAlt, FaLock, FaMailBulk } from 'react-icons/fa';
import Router from 'next/router';
import IUser from '@lib/models/user/user';
import { useDispatch } from 'react-redux';
import { userActions } from '@lib/redux/slices/user.slice';
import axiosInstance from '@core/utils/axios';
import { useAppStatus } from '@lib/hooks/useAppStatus';
import authLocalService from '@lib/services/auth/auth.local-service';
import { taskActions } from '@lib/redux/slices/task.slice';
import Login from '@lib/components/auth/Login';

const LoginPage = () => {
	return <Login />;
};

export default LoginPage;
