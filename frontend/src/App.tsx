import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import LoggedInRedirect from 'src/components/auth/LoggedInRedirect';
import PersistLogin from 'src/components/auth/PersistLogin';
import RequireAuth from 'src/components/auth/RequireAuth';
import AppLayout from 'src/components/ui/AppLayout';
import { AuthProvider } from 'src/context/AuthProvider';
import NotFound from 'src/pages/Error/NotFound';
import List from 'src/pages/List/List';
import Lists from 'src/pages/Lists/Lists';
import Login from 'src/pages/Login/Login';
import Questions from 'src/pages/Questions/Questions';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppLayout />}>
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
