import { gql } from '@apollo/client';

export interface REFRESH_TOKEN_DATA {
  refreshTokenV2: Pick<AuthResponseType, 'access_token' | 'refresh_token'>;
}

export const REFRESH_TOKEN_V2_OPERATION_NAME = 'RefreshTokenV2';

export const REFRESH_TOKEN_V2 = gql`
  mutation RefreshTokenV2 {
    refreshTokenV2 {
      access_token
      refresh_token
    }
  }
`;
