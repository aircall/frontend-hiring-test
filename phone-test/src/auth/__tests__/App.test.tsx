import { Tractor } from '@aircall/tractor';
import { MockedProvider } from '@apollo/client/testing';
import { queryHelpers, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider } from 'react-router-dom';
import router from '../../routes';

import { darkTheme } from '../../style/theme/darkTheme';
import nodesList from './data/nodesList.json';
import queryMocks from './helpers/requestMocks';

const TestingComponent = () => (
  <Tractor injectStyle theme={darkTheme}>
    <MockedProvider mocks={queryMocks} addTypename={false}>
      <RouterProvider router={router} />
    </MockedProvider>
  </Tractor>
);

describe('App Cases', () => {
  let originalLocalStorage: Storage;

  beforeEach(() => {
    originalLocalStorage = window.localStorage;
  });

  afterEach(() => {
    (window as any).localStorage = originalLocalStorage;
  });

  test('Render just fine', () => {
    render(<TestingComponent />);
  });

  test('Log in / paginate calls / get call details / log out', async () => {
    // Render
    const { container } = render(<TestingComponent />);

    // Fill form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    userEvent.type(emailInput, 'some@where.com');
    userEvent.type(passwordInput, 'dummy_pass');

    // Submit form
    const loginButton = screen.getByText(/login/i);
    await userEvent.click(loginButton);

    // Redirect to Calls History
    let callsListTitle = await screen.findByText(/calls history/i);
    expect(callsListTitle).toBeInTheDocument();

    const firstCallInPage1 = (await screen.findAllByText(/\+33/))[0];

    // Navigate to Page 5
    const PAGE_TO_NAVIGATE = 5;
    const page5 = screen.getByText(PAGE_TO_NAVIGATE);
    expect(page5).toBeInTheDocument();
    userEvent.click(page5);

    callsListTitle = await screen.findByText(/calls history/i);
    expect(callsListTitle).toBeInTheDocument();
    expect(firstCallInPage1).not.toBeInTheDocument();

    const queryById = queryHelpers.queryByAttribute.bind(null, 'id');

    const callBox = queryById(container, nodesList[PAGE_TO_NAVIGATE * 5].id);
    if (callBox) userEvent.click(callBox);
    expect(callsListTitle).not.toBeInTheDocument();

    const callsDetailsTitle = await screen.findByText(/calls details/i);
    expect(callsDetailsTitle).toBeInTheDocument();
    expect(screen.getByText(/id:/i)).toBeInTheDocument();
    expect(screen.getByText(/is archived/i)).toBeInTheDocument();

    // Logout
    const logout = screen.getByText(/logout/i);
    userEvent.click(logout);
    expect(callsDetailsTitle).not.toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(localStorage.getItem('access_token')).toBeNull();
  });
});
