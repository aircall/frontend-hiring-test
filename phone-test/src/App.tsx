import { Tractor } from '@aircall/tractor';

import './App.css';
import { darkTheme } from './style/theme/darkTheme';
import { RouterProvider } from 'react-router-dom';
import { GlobalAppStyle } from './style/global';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from './hooks/useAuth';
import { client } from './services/ApolloClient';
import { router } from './routes';

function App() {
  return (
    <Tractor injectStyle theme={darkTheme}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <RouterProvider router={router} />
          <GlobalAppStyle />
        </AuthProvider>
      </ApolloProvider>
    </Tractor>
  );
}

export default App;
