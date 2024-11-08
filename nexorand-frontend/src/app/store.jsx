import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import leaderboardReducer from '../features/leaderboard/leaderboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    leaderboard: leaderboardReducer,
  },
});

export default store;
