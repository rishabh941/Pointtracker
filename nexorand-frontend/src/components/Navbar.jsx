import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center">
      <h1 className="text-white text-2xl font-bold">Nexorand</h1>
      {user ? (
        <div className="flex items-center space-x-4">
          <div className="text-white">
            <p className="font-semibold">{user.firstName}</p>
            <p className="text-sm">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-100"
        >
          Login
        </button>
      )}
    </nav>
  );
}

export default Navbar;
