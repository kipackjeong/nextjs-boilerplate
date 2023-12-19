'use client';
import PageLayout from '@core/layouts/PageLayout';
import Auth from '@lib/components/Auth';
import DailyBoard from '@lib/components/Dailyboard';
import SideBar from '@lib/components/nav/SideBar';

const DailyboardPage = () => {
	return (
		<Auth>
			<SideBar />
			<PageLayout>
				<DailyBoard />
			</PageLayout>
		</Auth>
	);
};

export default DailyboardPage;
