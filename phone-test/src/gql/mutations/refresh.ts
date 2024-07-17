import { gql } from '@apollo/client';

export const REFRESH_TOKEN_V2 = gql`
  mutation refreshTokenV2 {
    refreshTokenV2 {
      access_token
      refresh_token
      user {
        id
        username
      }
    }
  }
`;
