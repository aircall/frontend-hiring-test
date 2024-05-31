import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';
import { Typography } from '@aircall/tractor';

export const ErrorPage = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return <NotFoundPage />;
  }

  return (
    <div>
      <Typography>Opps, it is error page!</Typography>
    </div>
  );
};
