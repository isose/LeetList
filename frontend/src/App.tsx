import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PersistLogin from '../components/auth/PersistLogin';
import RequireAuth from '../components/auth/RequireAuth';
import Navbar from '../components/ui/Navbar';
import Lists from '../pages/Lists';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Questions from '../pages/Questions';
import Register from '../pages/Register';

const App = () => {
  return (
    <>
      <Navbar />
      <div className='main'>
        <Routes>
          <Route element={<PersistLogin />}>
            {/* public routes */}
            <Route path='/' element={<Questions />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />

            {/* authentication required routes */}
            <Route element={<RequireAuth />}>
              <Route path='/lists' element={<Lists />}></Route>
            </Route>

            {/* catch all */}
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
