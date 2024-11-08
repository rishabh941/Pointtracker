import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from './authSlice';

function RegisterForm() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', username: '', password: '' });
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields for firstName, lastName, email, username, password */}
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
