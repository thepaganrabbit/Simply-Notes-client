import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import 'bulma';

import App from './App.tsx'
import './index.scss'
import Signup from './pages/entrance/Signup/Signup.tsx';
import Entrance from './pages/entrance/index.tsx';
import Login from './pages/entrance/Login/Login.tsx';
import { Toaster } from 'react-hot-toast';
import AdminArea from './pages/AdminArea/AdminArea.tsx';


const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
  },
  {
    path: 'administration',
    element: <AdminArea />
  },
  {
    path: '/entrance',
    element: <Entrance />,
    children: [
      {
        path: '',
        element: <Signup />
      },
      {
        path: 'login',
        element: <Login />
      }
    ]
  },
  {
    path: '/error',
    element: <h1>Error</h1>
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <Toaster />
     <RouterProvider router={router} />
    </>
  </StrictMode>,
)
