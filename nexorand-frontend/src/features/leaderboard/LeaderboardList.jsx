import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard, claimPoints } from './leaderboardSlice';

function LeaderboardList() {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  const handleClaimPoints = (username) => {
    dispatch(claimPoints(username));
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {users.map((user) => (
        <div key={user._id} onClick={() => handleClaimPoints(user.username)}>
          {user.username} - {user.Points} points
        </div>
      ))}
    </div>
  );
}

export default LeaderboardList;
