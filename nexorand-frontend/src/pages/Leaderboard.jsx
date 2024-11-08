import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard, claimPoints } from '../features/leaderboard/leaderboardSlice'; // Import claimPoints here
import axios from '../api/axios';
import Modal from '../components/Modal';

function Leaderboard() {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state) => state.leaderboard);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserHistory, setSelectedUserHistory] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  // Fetch user history and open modal
  const fetchUserHistory = async (username) => {
    try {
      const response = await axios.post('/user/v1/your-history', { username });
      setSelectedUserHistory(response.data.data.slice(0, 6)); // Limit history to top 6 entries
      setModalTitle(`${username}'s History`);
      setIsModalOpen(true);
    } catch (error) {
      alert('Error fetching user history');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Leaderboard</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul className="border rounded-lg overflow-hidden shadow-md bg-white">
        {users.map((user, index) => (
          <li key={user._id} className="p-4 border-b flex justify-between items-center hover:bg-gray-100">
            <div>
              {/* Click on the username to open the modal for history */}
              <p 
                className="font-semibold cursor-pointer text-blue-600"
                onClick={() => fetchUserHistory(user.username)}
              >
                {user.username} - Rank: {index + 1}
              </p>
              <p className="text-sm text-gray-500">Prize: {user.Points}</p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-xl font-bold text-blue-600">{user.Points}</p>
              {/* Claim Points Button */}
              <button
                onClick={() => dispatch(claimPoints(user.username))}
                className="px-2 py-1 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600"
              >
                + Points
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for displaying user history */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        <ul>
          {selectedUserHistory.length > 0 ? (
            selectedUserHistory.map((entry, index) => (
              <li key={index} className="py-2">
                <p>Date: {entry.date}</p>
                <p>Points Awarded: {entry.pointsAwarded}</p>
              </li>
            ))
          ) : (
            <p>No history available</p>
          )}
        </ul>
      </Modal>
    </div>
  );
}

export default Leaderboard;
