import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ExpandableTab from '@core/components/ExpandableTab';
import { useAppStatus } from '../../hooks/useAppStatus';
import taskLocalService from '../../services/task/task.local-service';
import taskService from '@lib/services/task/task.service';
import TaskCard from '../task/TaskCard/TaskCard';
import { tabGlobalStyle } from './styles';
import { selectTasks } from '@lib/redux/slices/task.slice';
import { ITask } from '@lib/models/task';

const OverdueTab = () => {
	const [isLoading, setIsLoading] = useState(false);

	const [overdueTodos, setOverdueTodos] = useState([]);

	const tasks = useSelector(selectTasks);

	const { isOnline } = useAppStatus();

	useEffect(() => {
		setIsLoading(true);
		fetchOverdueTodos();

		// GET tasks/?after
		async function fetchOverdueTodos() {
			const newTasks = isOnline
				? await taskService.findOverdueTodos()
				: await taskLocalService.findOverdueTodos();

			setOverdueTodos(newTasks);

			setIsLoading(false);
		}
	}, [tasks]);

	return (
		<ExpandableTab
			className="OverdueTab"
			title="Overdue"
			isLoading={isLoading}
			defaultIsOpen={true}
			{...tabGlobalStyle}
		>
			{overdueTodos.map((t: ITask) => {
				return <TaskCard key={t._id} task={t} width="100%" />;
			})}{' '}
		</ExpandableTab>
	);
};

export default OverdueTab;
