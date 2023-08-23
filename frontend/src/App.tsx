import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import LoggedInRedirect from '../components/auth/LoggedInRedirect';
import PersistLogin from '../components/auth/PersistLogin';
import RequireAuth from '../components/auth/RequireAuth';
import Navbar from '../components/ui/Navbar';
import { AuthProvider } from '../context/AuthProvider';
import List from '../pages/List';
import Lists from '../pages/Lists';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Questions from '../pages/Questions';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Navbar />}>
        <Route element={<PersistLogin />}>
          {/* public routes */}
          <Route path='/' element={<Questions />} />
          <Route element={<LoggedInRedirect />}>
            <Route path='/login' element={<Login />} />
          </Route>
          {['/lists', 'my-lists'].map((path) => (
            <Route path={path} element={<Lists />} key='lists' />
          ))}
          <Route path='/list/:id' element={<List />} />

          {/* authentication required routes */}
          <Route element={<RequireAuth />} />

          {/* catch all */}
          <Route path='*' element={<NotFound />} />
        </Route>
      </Route>,
    ),
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />;
    </AuthProvider>
  );
};

export default App;
