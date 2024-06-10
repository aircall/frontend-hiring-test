import { useQuery } from '@apollo/client';
import { GET_USER } from '../../gql/queries';
import { UserDTO } from './types';

export const useGetUser = () => useQuery<UserDTO>(GET_USER);
