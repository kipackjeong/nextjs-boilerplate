import { FlexProps } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ExpandableTab from '@core/components/ExpandableTab';
import { useAppStatus } from '../../hooks/useAppStatus';
import taskLocalService from '../../services/task/task.local-service';
import taskService from '@lib/services/task/task.service';
import TaskCard from '../task/TaskCard/TaskCard';
import { selectTasks } from '@lib/redux/slices/task.slice';
import { tabGlobalStyle } from './styles';
type PriorityTabProps = {} & FlexProps;

const PriorityTab = (props: PriorityTabProps) => {
	const tasks = useSelector(selectTasks);

	const [topPriorityTasks, setTopPriorityTasks] = useState([]);

	const [isLoading, setIsLoading] = useState(true);

	const { isOnline } = useAppStatus();

	// Calling api for top 5 may not be needed everytime there is an update on tasks.
	useEffect(() => {
		setIsLoading(true);
		fetchTopFivePrioritizedTasks();

		// GET tasks/?sort=priority&top=5
		async function fetchTopFivePrioritizedTasks() {
			try {
				const tasks = isOnline
					? await taskService.findTopNByPriorityDescOrder(5)
					: await taskLocalService.findTopNByPriorityDescOrder(5);
				console.log('tasks: ');
				console.log(tasks);
				setTopPriorityTasks(tasks);
				setIsLoading(false);
			} catch (error) {}
		}
	}, [tasks]);

	return (
		<ExpandableTab
			className="PriorityTab"
			title="Priority"
			isLoading={isLoading}
			defaultIsOpen={true}
			{...tabGlobalStyle}
		>
			{topPriorityTasks.map((t, idx) => {
				return <TaskCard key={idx} task={t} width="100%" />;
			})}
		</ExpandableTab>
	);
};

export default PriorityTab;
