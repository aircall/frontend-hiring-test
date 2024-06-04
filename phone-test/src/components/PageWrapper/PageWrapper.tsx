import { Loader } from '../Loader';
import { Error } from '../Error';
import { NotFound } from '../NotFound';
import { PageWrapperProps } from './types';

export const PageWrapper = <T,>({ isLoading, error, data, children }: PageWrapperProps<T>) => {
  if (isLoading) return <Loader />;
  if (error) return <Error />;
  if (!data) return <NotFound />;
  return <>{children}</>;
};
