import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user/v1/get-users');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const claimPoints = createAsyncThunk(
  'leaderboard/claimPoints',
  async (username, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.patch('/user/v1/claim-points', { username });
      const newPoints = response.data.data.Points;
      dispatch(updatePoints({ username, newPoints }));
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: { users: [], isLoading: false, error: null },
  reducers: {
    updatePoints: (state, action) => {
      const { username, newPoints } = action.payload;
      const user = state.users.find((user) => user.username === username);
      if (user) {
        user.Points = newPoints;
      }
      // Sort the users by points in descending order
      state.users.sort((a, b) => b.Points - a.Points);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        // Sort users by points initially
        state.users = action.payload.sort((a, b) => b.Points - a.Points);
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { updatePoints } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
