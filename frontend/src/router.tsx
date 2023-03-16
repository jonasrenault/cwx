import { createBrowserRouter } from 'react-router-dom'
import Root from './routes/root'
import Home, { loader as wallsLoader } from './routes/home'
import ErrorPage from './error-page'
import { Profile } from './routes/profile'
import Login from './routes/login'
import Register from './routes/register'
import Users, { loader as usersLoader } from './routes/users'
import WallView, { loader as wallLoader } from './routes/wall'
import RouteView from './routes/route'

export const routes = [
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home />, loader: wallsLoader },
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
        path: 'wall/:wallId',
        element: <WallView />,
        id: 'wall',
        loader: wallLoader,
        children: [
          {
            path: ':routeId',
            element: <RouteView />,
          },
        ],
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
