import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { NotFoundPage } from '../NotFoundPage/NotFound';

export const ErrorBoundary = () => {
  const error = useRouteError();
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    console.log(error);
    if (error.status === 404) return <NotFoundPage />;
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = 'Unknown error';
  }

  return <div>{errorMessage}</div>;
};
