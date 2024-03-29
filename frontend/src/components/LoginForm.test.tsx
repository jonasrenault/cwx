import { expect, it } from 'vitest'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/auth'
import { SnackBarProvider } from '../contexts/snackbar'
import LoginForm from './LoginForm'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
const server = setupServer(
  // Upon loading the auth context tries to load user profile
  // return 401 to simulate logged out user
  rest.get(API_URL + 'users/me', (req, res, ctx) => {
    return res(ctx.status(401))
  }),

  rest.post(API_URL + 'login/access-token', (req, res, ctx) => {
    return res(
      ctx.json({
        access_token: ACCESS_TOKEN,
        token_type: 'bearer',
      }),
    )
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function setup() {
  const user = userEvent.setup()
  const route = '/some-route'
  const utils = render(
    <AuthProvider>
      <SnackBarProvider>
        <MemoryRouter initialEntries={[route]}>
          <LoginForm />
        </MemoryRouter>
      </SnackBarProvider>
    </AuthProvider>,
  )
  const setEmailInput = (value: string) => user.type(utils.getByLabelText(/Adresse mail/i), value)
  const setPasswordInput = (value: string) =>
    user.type(utils.getByLabelText(/Mot de passe/i), value)
  return {
    ...utils,
    user,
    setEmailInput,
    setPasswordInput,
  }
}

it('should render a sign in button', async () => {
  const { getByRole, user } = setup()
  const registerByMailBtn = getByRole('button', { name: 'Connexion avec adresse mail' })
  await user.click(registerByMailBtn)
  expect(getByRole('button', { name: 'Connexion' })).toHaveTextContent(/Connexion/i)
})

it('should display required helper text', async () => {
  const { getByRole, getByText, user } = setup()
  const registerByMailBtn = getByRole('button', { name: 'Connexion avec adresse mail' })
  await user.click(registerByMailBtn)

  const loginBtn = getByRole('button', { name: 'Connexion' })
  await user.click(loginBtn)

  expect(getByText(/Une adresse mail est nécessaire./i)).toBeVisible()
  expect(getByText(/Un mot de passe est nécessaire./i)).toBeVisible()
})

it('should login user', async () => {
  const { getByRole, user, setEmailInput, setPasswordInput } = setup()
  const registerByMailBtn = getByRole('button', { name: 'Connexion avec adresse mail' })
  await user.click(registerByMailBtn)

  await setEmailInput('john@example.com')
  await setPasswordInput('johnjohn')
  const loginBtn = getByRole('button', { name: 'Connexion' })

  server.use(
    rest.get(API_URL + 'users/me', (req, res, ctx) => {
      return res(
        ctx.json({
          email: 'john@example.com',
          is_active: true,
          is_superuser: false,
          uuid: '48f0c771-1d00-4595-b1b4-f2ee060237bc',
        }),
      )
    }),
  )

  await user.click(loginBtn)

  expect(getByRole('alert')).toHaveTextContent('Connexion réussie.')
  expect(localStorage.getItem('token')).toEqual(ACCESS_TOKEN)
})

it('should handle server errors', async () => {
  const { getByRole, user, setEmailInput, setPasswordInput } = setup()
  const registerByMailBtn = getByRole('button', { name: 'Connexion avec adresse mail' })
  await user.click(registerByMailBtn)
  await setEmailInput('john@example.com')
  await setPasswordInput('johnjohn')
  const loginBtn = getByRole('button', { name: 'Connexion' })

  const error = 'Incorrect email or password'
  server.use(
    rest.post(API_URL + 'login/access-token', (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ detail: error }))
    }),
  )

  await user.click(loginBtn)

  expect(getByRole('alert')).toHaveTextContent(error)
})
