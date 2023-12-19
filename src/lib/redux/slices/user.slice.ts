import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import IUser from '@lib/models/user/user';
import indexReducer from '../stores';
import { AppState } from '../stores/app.store';

type SetUserAction = {
	payload?: IUser;
};

export interface UserState {
	user: IUser | null;
}

const initialState: UserState = {
	user: null,
};
export const userSlice = createSlice({
	name: 'user',
	initialState: initialState,
	reducers: {
		setUser(state, action: SetUserAction) {
			state.user = action.payload!;
		},
	},
});

export const selectUser = (state: AppState) => {
	return state.user.user;
};

export const userActions = userSlice.actions;
export default userSlice.reducer;
