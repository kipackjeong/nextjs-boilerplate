/**
 * Checks app's status
 */
import { useEffect, useState } from 'react';
import { singletonHook } from 'react-singleton-hook';
import { db } from '../db/localdb';
import authLocalService from '@lib/services/auth/auth.local-service';

const isOnline = undefined;

const initSetting = {
	isOnline,
	setIsOnline: () => {},
};
export const useAppStatus = singletonHook(initSetting, () => {
	const [isOnline, setIsOnline] = useState<boolean | undefined>(
		initSetting.isOnline
	);

	useEffect(() => {
		async function checkConnectionWithAPI() {
			try {
				const isOnline = await authLocalService.getOnlineStatus();

				if (isOnline) {
					setIsOnline(true);
				} else {
					setIsOnline(false);
				}
			} catch (error) {
				console.log('error: ' + error);
				db.open();
				setIsOnline(false);
			}
		}

		checkConnectionWithAPI();
	}, []);

	return { isOnline, setIsOnline };
});
