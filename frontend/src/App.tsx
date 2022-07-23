import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Questions from '../pages/Questions';
import Register from '../pages/Register';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Questions />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  );
};

export default App;
