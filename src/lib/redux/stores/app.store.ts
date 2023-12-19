import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { taskSlice } from '../slices/task.slice';
import { dateSlice } from '../slices/date.slice';
import { userSlice } from '../slices/user.slice';

const store = configureStore({
	reducer: {
		[taskSlice.name]: taskSlice.reducer,
		[dateSlice.name]: dateSlice.reducer,
		[userSlice.name]: userSlice.reducer,
	},

	devTools: true,
	// middleware: (getDefaultMiddle) =>
	// 	getDefaultMiddle({
	// 		serializableCheck: false,
	// 	}).concat(logger),
});
export default store;
export type AppState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	AppState,
	unknown,
	Action
>;
