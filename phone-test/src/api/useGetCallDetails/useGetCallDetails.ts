import { useQuery } from '@apollo/client';
import { GET_CALL_DETAILS } from '../../gql/queries';
import { CallDetailsParams, CallDetailsDTO } from './types';

export const useGetCallDetails = ({ id }: CallDetailsParams) =>
  useQuery<CallDetailsDTO>(GET_CALL_DETAILS, {
    variables: {
      id
    }
  });
