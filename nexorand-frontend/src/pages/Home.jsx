import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard, claimPoints } from '../features/leaderboard/leaderboardSlice';
import axios from '../api/axios';
import Modal from '../components/Modal';

function Home() {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state) => state.leaderboard);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserHistory, setSelectedUserHistory] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [view, setView] = useState('daily'); // For handling daily, weekly, monthly tabs
  const [notification, setNotification] = useState(null); // Notification state

  // Conversion rate for points to dollars
  const POINTS_TO_DOLLAR_RATE = 0.72;

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  // Calculate the total points and dollar amount dynamically
  const totalPoints = users.reduce((sum, user) => sum + user.Points, 0);
  const totalDollarAmount = (totalPoints * POINTS_TO_DOLLAR_RATE).toFixed(2);

  // Function to fetch user history and open modal
  const fetchUserHistory = async (username) => {
    try {
      const response = await axios.post('/user/v1/your-history', { username });
      setSelectedUserHistory(response.data.data.slice(0, 6)); // Limit history to top 6 entries
      setModalTitle(`${username}'s History`); // Set modal title
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      alert('Error fetching user history');
    }
  };

  // Function to claim points for a user
  const handleClaimPoints = (username) => {
    dispatch(claimPoints(username)).then(() => {
      setNotification(`Points claimed successfully for ${username}`);
      setTimeout(() => {
        setNotification(null);
      }, 3000); // Hide notification after 3 seconds
    });
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        {/* Displaying dynamic total points and dollar amount */}
        <h1 className="text-2xl font-bold">{totalPoints} Today ${totalDollarAmount}</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Leaderboard</button>
      </div>

      <div className="flex justify-center space-x-6 mb-4">
        {['daily', 'weekly', 'monthly'].map((tab) => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            className={`px-4 py-2 rounded-md ${
              view === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="border rounded-lg overflow-hidden shadow-md bg-white">
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <ul>
          {users.slice(0, 10).map((user, index) => (
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
                  onClick={() => handleClaimPoints(user.username)}
                  className="px-2 py-1 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600"
                >
                  + Points
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Notification Popup */}
      {notification && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          {notification}
        </div>
      )}

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

export default Home;
