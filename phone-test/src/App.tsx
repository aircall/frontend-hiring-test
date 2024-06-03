import './App.css';
import { RouterProvider } from 'react-router-dom';
import { Tractor } from '@aircall/tractor';
import { ApolloProvider } from '@apollo/client';
import { darkTheme } from './style/theme/darkTheme';
import { GlobalAppStyle } from './style/global';
import client from './client';
import router from './router';
import { Suspense } from 'react';

function App() {
  return (
    <Tractor injectStyle theme={darkTheme}>
      <ApolloProvider client={client}>
        <Suspense fallback={null}>
          <RouterProvider router={router} />
          <GlobalAppStyle />
        </Suspense>
      </ApolloProvider>
    </Tractor>
  );
}

export default App;
