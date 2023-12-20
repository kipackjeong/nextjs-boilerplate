import {
	Button,
	ButtonGroup,
	Flex,
	FormControl,
	FormLabel,
	Input,
} from '@chakra-ui/react';
import { Scrollbars } from 'react-custom-scrollbars';
import React, { LegacyRef, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import ModalLayout from '@core/layouts/ModalLayout';
import { ITask } from '@lib/models/task';
import { FocusLevelSlider } from './atoms';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import TimePicker from './atoms/TimePicker';
import style from './style';
import TaskTypeRadio from './atoms/TaskTypeRadio';
import taskLocalService from '../../../services/task/task.local-service';
import { useAppStatus } from '../../../hooks/useAppStatus';
import PriorityRadioCard from './atoms/PriorityRadioCard';
import taskService from '@lib/services/task/task.service';
import CategorySelection from './atoms/CategorySelection';

export interface RadioRef extends HTMLDivElement {
	value: string;
}
export interface FocusLevelRef extends HTMLDivElement {
	value: string;
}

type TaskFormProps = {
	task: ITask;
	setTask?: any;
	onCancel?: any;
	onSubmit?: any;
	isUpdateForm?: boolean;
};

const TaskForm = ({
	task,
	onCancel,
	onSubmit,
	isUpdateForm = false,
}: TaskFormProps) => {
	console.log('TaskForm - render');
	// #region Hooks
	const titleRef = useRef<HTMLInputElement>();
	const reflectionRef = useRef<HTMLInputElement>();
	const [priority, setPriority] = useState<number>(2);
	const focusLevelRef = useRef<FocusLevelRef>('');
	const [taskType, setTaskType] = useState(task.taskType);
	const [selectedCategory, setSelectedCategory] = useState(
		task.category ?? ''
	);
	const [startTime, setStartTime] = useState<Date>(
		new Date(task ? task.timeInterval!.startTime : Date.now() + 10)
	);

	const [endTime, setEndTime] = useState<Date>(
		new Date(task ? task.timeInterval!.endTime : Date.now() + 10)
	);

	const { isOnline } = useAppStatus();

	const dispatch = useDispatch();

	// #endregion

	// #region Handlers
	async function onSubmitHandler(e: {
		preventDefault: () => void;
	}): Promise<void> {
		e.preventDefault();

		console.log('TaskForm - onSubmitHandler');
		// case when creating new task
		console.log('--Create Task');

		let timeInterval = {
			startTime,
			endTime,
		};

		if (startTime > endTime) {
			const temp = startTime;
			timeInterval.startTime = endTime;
			timeInterval.endTime = temp;
		}
		console.log('priority before submit: ' + priority);

		const createPayload: ITask = {
			...task,
			detail: titleRef.current?.value,
			reflection: reflectionRef.current?.value,
			focusLevel: Number(focusLevelRef.current?.value),
			timeInterval,
			taskType: taskType,
			category: selectedCategory,
			priority: Number(priority),
		};

		if (isUpdateForm) {
			console.log('createPayload: ', createPayload);
			isOnline
				? await taskService.update(createPayload, dispatch)
				: await taskLocalService.update(createPayload, dispatch);
		} else {
			console.log('createPayload: ', createPayload);

			isOnline
				? await taskService.create(createPayload, dispatch)
				: await taskLocalService.create(createPayload, dispatch);
		}

		onSubmit(e);
	}

	function onClose() {
		onCancel();
	}
	function onCancelClickHandler() {
		onCancel();
	}

	function onStartTimeChangeHandler(hour: number, minute: number) {
		setStartTime((prev) => {
			const newState = new Date(prev);
			console.log('TaskForm - onStartTimeChangeHandler - setStartTime');
			newState.setHours(hour);
			newState.setMinutes(minute);
			return newState;
		});
	}

	function onEndTimeChangeHandler(hour: number, minute: number) {
		setEndTime((prev) => {
			const newState = new Date(prev);
			console.log('TaskForm - onEndTimeChangeHandler - setEndTime');
			newState.setHours(hour);
			newState.setMinutes(minute);
			return newState;
		});
	}

	function onTaskTypeRadioChange(
		value: React.SetStateAction<string | undefined>
	) {
		setTaskType(value);
	}

	function onCategorySelect(categoryId: string) {
		setSelectedCategory(categoryId);
	}
	// #endregion

	function priorityChangeHandler(option: string) {
		setPriority(Number(option));
	}

	//#region Components

	const taskTypeRadio = (
		<TaskTypeRadio
			value={task.taskType!}
			onChange={onTaskTypeRadioChange}
		/>
	);

	const timePicker = (
		<TimePicker
			startTime={startTime}
			endTime={endTime}
			onStartTimeChange={onStartTimeChangeHandler}
			onEndTimeChange={onEndTimeChangeHandler}
			setTime={() => {}}
		/>
	);

	const formInputs = (
		<>
			<FormControl
				{...style.formControl}
				variant="floating"
				id="detail"
				className="detail-input"
				isRequired
			>
				<Input
					ref={titleRef as LegacyRef<HTMLInputElement>}
					width="100%"
					placeholder=""
					defaultValue={task.detail}
				/>
				<FormLabel>Title</FormLabel>
			</FormControl>
			<FormControl
				{...style.formControl}
				id="reflection"
				className="reflection-input"
				variant="floating"
				isInvalid={false}
			>
				<Input
					ref={reflectionRef as LegacyRef<HTMLInputElement>}
					width="100%"
					placeholder=" "
					defaultValue={task.reflection}
				/>
				<FormLabel>Reflection </FormLabel>
			</FormControl>
		</>
	);

	const categorySelect = (
		<CategorySelection
			onSelect={onCategorySelect}
			selectedCategory={selectedCategory}
		/>
	);

	const focusLevelSlider = (
		<FormControl {...style.formControl}>
			<FocusLevelSlider
				focusLevelRef={focusLevelRef!}
				defaultValue={task && task.focusLevel}
			/>
		</FormControl>
	);

	const buttons = (
		<ButtonGroup pt={'45px'} width="22rem" justifyContent="space-evenly">
			<Button type="submit" variant="nakedblue">
				Save
			</Button>
			<Button variant="nakedRed" onClick={onCancelClickHandler}>
				Cancel
			</Button>
		</ButtonGroup>
	);
	//#endregion
	return (
		<>
			<ModalLayout
				title="Create Task"
				width="550px"
				height="750px"
				haveButton={false}
				show={true}
				onClose={onClose}
			>
				<Scrollbars autoHide={true}>
					<form
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
						onSubmit={onSubmitHandler}
					>
						<Flex
							width="80%"
							flexDir={'column'}
							alignItems="center"
						>
							{timePicker}
							{taskTypeRadio}
							{formInputs}
							{categorySelect}
							{taskType == 'To Do' && (
								<PriorityRadioCard
									onChange={priorityChangeHandler}
									defaultValue={priority}
								/>
							)}
							{focusLevelSlider}
							{buttons}
						</Flex>
					</form>
				</Scrollbars>
			</ModalLayout>
		</>
	);
};
export default TaskForm;
