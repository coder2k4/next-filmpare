import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
  isAuthenticated: false,
  session_id: '',
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.session_id = localStorage.getItem('session_id');

      localStorage.setItem('account_id', action.payload.id);
    },
  },
});

export const { actions: { setUser },
  reducer: authSliceReducer } = authSlice;

export const userSelector = (state) => state.user;
