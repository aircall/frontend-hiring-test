import { gql } from '@apollo/client';

export const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshTokenV2 {
      access_token
    }
  }
`;