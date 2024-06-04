import { ApolloError } from '@apollo/client';
import { ReactNode } from 'react';

export interface PageWrapperProps<T = any> {
  isLoading: boolean;
  error?: ApolloError;
  data: T;
  children: ReactNode;
}
