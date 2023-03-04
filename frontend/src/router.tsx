import { createBrowserRouter } from 'react-router-dom'
import Root from './routes/root'
import Home from './routes/home'
import ErrorPage from './error-page'
import { Profile } from './routes/profile'
import Login from './routes/login'
import Register from './routes/register'
import Users, { loader as usersLoader } from './routes/users'
import WallViewer from './components/WallViewer'
import { croixNivert, laPlaine } from './models/wall.fixtures'

export const routes = [
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'users',
        element: <Users />,
        loader: usersLoader,
      },
      {
        path: 'walls',
        element: <WallViewer wall={laPlaine} width='600' height='300' />,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
