import { gql } from '@apollo/client';

export const GET_USER = gql`
  query {
    me {
      id
      username
    }
  }
`;
