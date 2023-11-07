import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from './hooks/useAuth';
import { client } from './configurations/apollo';
import { darkTheme } from './style/theme/darkTheme';
import { GlobalAppStyle } from './style/global';
import { router } from './configurations/router';
import { RouterProvider } from 'react-router-dom';
import { StrictMode } from 'react';
import { Tractor } from '@aircall/tractor';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <Tractor injectStyle theme={darkTheme}>
      <GlobalAppStyle />
      <ApolloProvider client={client}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ApolloProvider>
    </Tractor>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
