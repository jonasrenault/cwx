// @vitest-environment happy-dom

import { fireEvent, render, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { expect, it } from 'vitest'
import { AuthProvider } from '../contexts/auth'
import { SnackBarProvider } from '../contexts/snackbar'
import { User } from '../models/user'
import Users, { loader as usersLoader } from './users'

const API_URL = import.meta.env.VITE_BACKEND_API_URL
const profile: User = {
  email: 'admin@example.com',
  is_active: true,
  is_superuser: true,
  uuid: '6bb9c5ba-e558-4a2a-9a33-22b2f21072d0',
}

const users: Array<User> = [
  {
    email: 'john@example.com',
    is_active: true,
    is_superuser: false,
    uuid: '48f0c771-1d00-4595-b1b4-f2ee060237bc',
  },
  {
    email: 'admin@example.com',
    is_active: true,
    is_superuser: true,
    uuid: '6bb9c5ba-e558-4a2a-9a33-22b2f21072d0',
  },
  {
    email: 'ericsmith@gmail.com',
    is_active: true,
    is_superuser: false,
    first_name: 'Eric',
    last_name: 'Smith',
    uuid: 'd1ba04b9-cd9f-40fe-8956-8a0198f47884',
  },
]

const server = setupServer(
  rest.get(API_URL + 'users/me', (req, res, ctx) => {
    return res(ctx.json(profile))
  }),
  rest.get(API_URL + 'users', (req, res, ctx) => {
    return res(ctx.json(users))
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function setup() {
  const user = userEvent.setup()
  const routes = [
    {
      path: '/',
      element: <>Navigated to Home</>,
    },
    {
      path: '/users',
      element: <Users />,
      loader: usersLoader,
    },
  ]

  const router = createMemoryRouter(routes, { initialEntries: ['/users'] })

  const utils = render(
    <AuthProvider>
      <SnackBarProvider>
        <RouterProvider router={router} />,
      </SnackBarProvider>
    </AuthProvider>,
  )

  return {
    ...utils,
    user,
    router,
  }
}

it('should render user list', async () => {
  const { getByRole } = setup()
  await waitFor(() => {
    expect(getByRole('list')).toBeInTheDocument()
  })

  const userList = getByRole('list')
  const userItems = await within(userList).findAllByRole('listitem')
  expect(userItems).toHaveLength(users.length)
  userItems.forEach((item, idx) => {
    expect(item).toHaveTextContent(users[idx].email)
  })
})

it('should redirect if loader throws error', async () => {
  server.use(
    rest.get(API_URL + 'users', (req, res, ctx) => {
      return res(ctx.status(401), ctx.json('Invalid credentials.'))
    }),
  )
  const { router } = setup()
  await waitFor(() => expect(router.state.location.pathname).toEqual('/'))
})

it('should display delete buttons for other users', async () => {
  const { getAllByRole, getByRole } = setup()
  await waitFor(() => {
    expect(getByRole('list')).toBeInTheDocument()
  })

  const userItems = getAllByRole('listitem')
  expect(within(userItems[0]).getByRole('button', { name: 'delete' })).toBeInTheDocument()
})

it('should not display delete button for profile', async () => {
  const { getAllByRole, getByRole } = setup()
  await waitFor(() => {
    expect(getByRole('list')).toBeInTheDocument()
  })

  const userItems = getAllByRole('listitem')
  expect(within(userItems[1]).queryByRole('button', { name: 'delete' })).not.toBeInTheDocument()
})

it('should delete user from the list', async () => {
  const {
    getAllByRole,
    getByRole,
    queryByRole,
    getByTestId,
    queryByTestId,
    getByLabelText,
    queryByLabelText,
    user,
  } = setup()
  await waitFor(() => {
    expect(getByRole('list')).toBeInTheDocument()
  })

  server.use(
    rest.delete(API_URL + `users/${users[2].uuid}`, (req, res, ctx) => {
      return res(ctx.status(200))
    }),
  )

  const userItems = getAllByRole('listitem')
  const userBtn = getByTestId(users[2].uuid)

  // select user 2. Expect his profile to be displayed
  await user.click(userBtn)
  await waitFor(() => {
    expect(getByLabelText(/Adresse mail/i)).toHaveValue(users[2].email)
  })

  // click on delete button. Expect confirmation modal to be shown
  const deleteBtn = within(userItems[2]).getByRole('button', { name: 'delete' })
  await user.click(deleteBtn)
  const confirmBtn = queryByRole('button', { name: 'Confirm' })
  await waitFor(() => {
    expect(confirmBtn).toBeVisible()
  })

  // click confirm. Expect profile view to be hidden, and user to be deleted
  // from the list
  await user.click(confirmBtn)
  await waitFor(() => {
    expect(getByRole('alert')).toHaveTextContent('User deleted successfully.')
  })
  expect(getAllByRole('listitem')).toHaveLength(2)
  expect(queryByTestId(users[2].uuid)).not.toBeInTheDocument()
  expect(queryByLabelText(/Adresse mail/i)).not.toBeInTheDocument()
})

it('should display profile info when user selected', async () => {
  const { getByRole, getByTestId, getByLabelText, user } = setup()
  await waitFor(() => {
    expect(getByRole('list')).toBeInTheDocument()
  })

  for (let idx = 0; idx < users.length; idx++) {
    await user.click(getByTestId(users[idx].uuid))
    await waitFor(() => {
      expect(getByLabelText(/Adresse mail/i)).toHaveValue(users[idx].email)
    })
  }
})

it('should update user info in the user list', async () => {
  const { getByRole, getByTestId, getByLabelText, queryByRole, user } = setup()
  await waitFor(() => expect(getByRole('list')).toBeInTheDocument())

  server.use(
    rest.patch(API_URL + `users/${users[2].uuid}`, (req, res, ctx) => {
      return res(
        ctx.json({
          email: 'ericsmith@gmail.com',
          is_active: true,
          is_superuser: false,
          first_name: 'Brad',
          last_name: 'Pitt',
          uuid: 'd1ba04b9-cd9f-40fe-8956-8a0198f47884',
        }),
      )
    }),
  )

  // select user 2
  await user.click(getByTestId(users[2].uuid))
  await waitFor(() => expect(getByLabelText(/Prénom/i)).toHaveValue(users[2].first_name))

  // update its first and last name
  await user.type(getByLabelText(/Prénom/), 'Brad')
  await user.type(getByLabelText(/Nom/), 'Pitt')
  const profileform = getByTestId('user-profile-form')
  fireEvent.submit(profileform)

  await waitFor(() => {
    expect(queryByRole('alert')).toHaveTextContent('Le profil utilisateur a été mis à jour.')
    expect(getByTestId(users[2].uuid)).toHaveTextContent('Brad Pitt')
  })
})
