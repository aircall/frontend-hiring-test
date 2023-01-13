import { LOGIN } from '../../../gql/mutations';
import { PAGINATED_CALLS } from '../../../gql/queries';
import { GET_CALL_DETAILS } from '../../../gql/queries/getCallDetails';
import nodesList from '../data/nodesList.json';

const queryMocks = [
  {
    request: {
      query: PAGINATED_CALLS,
      variables: {
        offset: 0, // Page 1 / Size 5
        limit: 5
      }
    },
    result: {
      data: {
        paginatedCalls: {
          __typename: 'PaginatedCalls',
          nodes: nodesList.slice(0, 5), // From 0 to 5 calls
          totalCount: 100,
          hasNextPage: true
        }
      }
    }
  },
  {
    request: {
      query: PAGINATED_CALLS,
      variables: {
        offset: (5 - 1) * 5, // Page 5 / Size 5
        limit: 5
      }
    },
    result: {
      data: {
        paginatedCalls: {
          __typename: 'PaginatedCalls',
          nodes: nodesList.slice(25, 30), // From 25 to 30 calls
          totalCount: 100,
          hasNextPage: true
        }
      }
    }
  },
  {
    request: {
      query: GET_CALL_DETAILS,
      variables: {
        id: nodesList[25].id // We are querying the first call on the 5th page
      }
    },
    result: {
      data: {
        call: nodesList[25]
      }
    }
  }
];

const mutationMocks = [
  {
    request: {
      query: LOGIN,
      variables: { input: { username: 'some@where.com', password: 'dummy_pass' } }
    },
    result: {
      data: {
        login: {
          access_token: '00.access_token.99',
          refresh_token: '00.refresh_token.99',
          user: {
            id: 'some@where.com',
            username: 'some@where.com'
          }
        }
      }
    }
  }
];

const requestMocks = [...queryMocks, ...mutationMocks];

export default requestMocks;
