import { Tractor } from '@aircall/tractor';
import { ApolloProvider } from '@apollo/client';
import { fireEvent, render, screen } from '@testing-library/react';
import {client} from '../../App';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../hooks/useAuth';
import { darkTheme } from '../../style/theme/darkTheme';
import { ProtectedLayout } from './ProtectedLayout';

const TProtectedLayout = () => (
  <Tractor injectStyle theme={darkTheme}>
    <ApolloProvider client={client}>
      <MemoryRouter initialEntries={['/page']}>
        <Routes>
          <Route element={<AuthProvider />}>
            <Route path="/login" element={<p>Login page</p>} />
            <Route path="/page" element={<ProtectedLayout />}>
              <Route path="/page" element={<p>A call page</p>} />
            </Route>
          </Route>
        </Routes>
      </MemoryRouter>
    </ApolloProvider>
  </Tractor>
);

describe('ProtectedLayout Case', () => {
  test('Render componendt', async () => {
    render(<TProtectedLayout />);
  });

  test('Remove tokens and redirect', async () => {
    render(<TProtectedLayout />);

    window.localStorage.setItem('access_token', 'test access token');
    window.localStorage.setItem('refresh_token', 'test refresh token');

    expect(window.localStorage.getItem('access_token')).not.toBeNull();
    expect(window.localStorage.getItem('refresh_token')).not.toBeNull();
    expect(screen.getByText(/a call page/i)).toBeInTheDocument();

    const logoutLink = screen.getByText(/logout/i);
    fireEvent.click(logoutLink);

    expect(screen.queryByText(/call page/i)).not.toBeInTheDocument();

    expect(window.localStorage.getItem('access_token')).toBeNull();
    expect(window.localStorage.getItem('refresh_token')).toBeNull();
  });
});
