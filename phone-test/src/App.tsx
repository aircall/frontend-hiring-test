import './App.css';
import { RouterProvider } from 'react-router-dom';
import { Tractor } from '@aircall/tractor';
import { ApolloProvider } from '@apollo/client';
import { darkTheme } from './style/theme/darkTheme';
import { GlobalAppStyle } from './style/global';
import client from './client';
import router from './router';

function App() {
  return (
    <Tractor injectStyle theme={darkTheme}>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
        <GlobalAppStyle />
      </ApolloProvider>
    </Tractor>
  );
}

export default App;
