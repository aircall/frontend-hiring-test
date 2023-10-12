import { gql } from "@apollo/client";
import { CALL_FIELDS } from "../fragments";

export const REFRESH_TOKEN = gql`
  mutation {
    refreshTokenV2 {
      access_token
      refresh_token
    }
  }
`
