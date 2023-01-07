import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { CallsListPage } from '../../CallsList';
import { PAGINATED_CALLS } from '../../../gql/queries';
import nodesList from './data/nodesList.json';

const requestMocks = [
  {
    request: {
      query: PAGINATED_CALLS,
      variables: {
        offset: (1 - 1) * 5, // Page 1 / Size 5
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
  }
];

describe('Call List Page Cases', () => {
  test('Renders just fine', async () => {
    expect(() =>
      render(
        <MockedProvider mocks={requestMocks} addTypename={false}>
          <MemoryRouter>
            <CallsListPage />
          </MemoryRouter>
        </MockedProvider>
      )
    ).not.toThrowError();
  });
});
