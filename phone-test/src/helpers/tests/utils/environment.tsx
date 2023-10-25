import { Tractor } from '@aircall/tractor';
import { MockedProvider } from '@apollo/client/testing';
import { RouterProvider } from 'react-router-dom';
import { router } from '../../../configurations/router';
import { AuthProvider } from '../../../hooks/useAuth';
import { GlobalAppStyle } from '../../../style/global';
import { darkTheme } from '../../../style/theme/darkTheme';
import { mockCallDetailsQuery } from './requests/callDetails';
import { mockLoginMutation } from './requests/login';
import { mockCallsQuery } from './requests/paginatedCalls';

export const App = () => (
  <Tractor injectStyle theme={darkTheme}>
    <GlobalAppStyle />
    <MockedProvider
      mocks={[mockLoginMutation, mockCallsQuery, mockCallDetailsQuery]}
      addTypename={false}
    >
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </MockedProvider>
  </Tractor>
);
