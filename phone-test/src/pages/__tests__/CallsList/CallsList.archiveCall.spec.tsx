import { Tractor } from '@aircall/tractor';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ARCHIVE_CALL } from '../../../gql/mutations';
import { PAGINATED_CALLS } from '../../../gql/queries';
import { darkTheme } from '../../../style/theme/darkTheme';
import { CallsListPage } from '../../CallsList';
import nodesList from './data/nodesList.json';

const requestMocks = [
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
      query: ARCHIVE_CALL,
      variables: {
        id: nodesList[0].id
      }
    },
    result: {
      data: {
        archiveCall: { ...nodesList[0], is_archived: !nodesList[0].is_archived }
      }
    }
  }
];

const TestingComponent = (
  <Tractor injectStyle theme={darkTheme}>
    <MockedProvider mocks={requestMocks} addTypename={false}>
      <MemoryRouter>
        <CallsListPage />
      </MemoryRouter>
    </MockedProvider>
  </Tractor>
);

describe('Archive Call Case', () => {
  test('Archive a call', async () => {
    render(TestingComponent);

    const prevClickArchiveOptions = await screen.findAllByText('archive');

    const archiveButton = screen.getAllByRole('button', { name: /archive/i })[0];
    userEvent.click(archiveButton);

    await waitFor(async () => {
      const postClickArchiveOptions = await screen.findAllByText('archive');
      expect(prevClickArchiveOptions.length).not.toEqual(postClickArchiveOptions.length);
    });
  });
});
