
/**
 * @defaultPaginationSize number of calls displayed per page 
 * @tokenExpirationMinutes refresh access token every n minutes
 * @env environment settings.
 */
export const Constants = {
    defaultPaginationSize: 5,
    tokenExpirationMinutes: 9,
    env: {
      api_url: 'https://frontend-test-api.aircall.dev/graphql',
      ws_url: 'wss://frontend-test-api.aircall.dev/websocket',
    },
  };
  
  
  export enum AppStatus {
    LOADING="LOADING",
    LOADED="LOADED"
  }

  export enum CallType {
    MISSED="missed",
    ANSWERED="answered"
  }

  export enum CallDirection {
    INBOUND="inbound",
    OUTBOUND="outbound"
  }

  //Options displayed on paginations below grids
  export const PAGE_SIZES = [
    {
      label: '5',
      value: 5
    },
    {
      label: '25',
      value: 25
    },
    {
      label: '50',
      value: 50
    },
    {
      label: '100',
      value: 100
    }
  ]