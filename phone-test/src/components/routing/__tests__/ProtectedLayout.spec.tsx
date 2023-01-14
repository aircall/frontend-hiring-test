import { Tractor } from '@aircall/tractor';
import { ApolloProvider } from '@apollo/client';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import apolloClient from '../../../auth';
import { AuthProvider } from '../../../hooks/useAuth';
import { darkTheme } from '../../../style/theme/darkTheme';
import { ProtectedLayout } from '../ProtectedLayout';

const TestingComponent = () => (
  <Tractor injectStyle theme={darkTheme}>
    <ApolloProvider client={apolloClient}>
      <MemoryRouter initialEntries={['/page']}>
        <Routes>
          <Route element={<AuthProvider />}>
            <Route path="/login" element={<p>Login form</p>} />
            <Route path="/page" element={<ProtectedLayout />}>
              <Route path="/page" element={<p>A single page</p>} />
            </Route>
          </Route>
        </Routes>
      </MemoryRouter>
    </ApolloProvider>
  </Tractor>
);

describe('ProtectedLayout Case', () => {
  test('Renders just fine', async () => {
    render(<TestingComponent />);
  });

  test('Logout removing tokens and redirecting', async () => {
    render(<TestingComponent />);

    window.localStorage.setItem('access_token', 'dummy access token');
    window.localStorage.setItem('refresh_token', 'dummy refresh token');

    expect(window.localStorage.getItem('access_token')).not.toBeNull();
    expect(window.localStorage.getItem('refresh_token')).not.toBeNull();
    expect(screen.getByText(/a single page/i)).toBeInTheDocument();

    const logoutLink = screen.getByText(/logout/i);
    fireEvent.click(logoutLink);

    expect(screen.queryByText(/single page/i)).not.toBeInTheDocument();
    const loginText = await screen.findByText(/login form/i);
    expect(loginText).toBeInTheDocument();
    expect(screen.getByText(/successfully logged out/i)).toBeInTheDocument();

    expect(window.localStorage.getItem('access_token')).toBeNull();
    expect(window.localStorage.getItem('refresh_token')).toBeNull();
  });
});
