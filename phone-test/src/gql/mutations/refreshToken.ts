import { gql } from '@apollo/client';

export const REFRESH_TOKEN = gql`
  mutation RefreshTokenV2 {
    refreshTokenV2 {
      access_token
      refresh_token
    }
  }
`;
