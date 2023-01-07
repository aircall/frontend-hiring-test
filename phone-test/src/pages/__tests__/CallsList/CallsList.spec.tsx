import { fireEvent, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { CallsListPage } from '../../CallsList';
import { PAGINATED_CALLS } from '../../../gql/queries';
import nodesList from './data/nodesList.json';
import { Tractor } from '@aircall/tractor';
import { darkTheme } from '../../../style/theme/darkTheme';

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
  },
  {
    request: {
      query: PAGINATED_CALLS,
      variables: {
        offset: (1 - 1) * 25, // Page 1 / Size 25
        limit: 25
      }
    },
    result: {
      data: {
        paginatedCalls: {
          __typename: 'PaginatedCalls',
          nodes: nodesList.slice(0, 25), // From 0 to 25 calls
          totalCount: 100,
          hasNextPage: true
        }
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
describe('Call List Page Cases', () => {
  beforeAll(() => {
    /*
     * Jest has troubles with some global props which doesn't have available
     * Let's mock it up
     */
    (global as any).ResizeObserver = class ResizeObserver {
      constructor(cb: any) {
        (this as any).cb = cb;
      }

      observe() {
        (this as any).cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }]);
      }

      unobserve() {}
    };

    (global as any).DOMRect = {
      fromRect: () => ({ top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 })
    };
  });

  test('Renders just fine', async () => {
    expect(() => render(TestingComponent)).not.toThrowError();
  });

  test('Resize list to 25', async () => {
    render(TestingComponent);

    const FIND_BY = /\+33/;

    let callEntries = await screen.findAllByText(FIND_BY);
    expect(callEntries.length).toBe(5);

    const resizeTo = (number: number) => {
      const dropdownSelector = document.querySelector('[data-test="select-trigger-container"]');

      if (dropdownSelector) {
        fireEvent.click(dropdownSelector);
        const option = document.querySelector(
          `[data-test="select-option-item-${number.toString()}"]`
        );

        if (option) {
          fireEvent.click(option);
        }
      }
    };

    [25, 50].forEach(async (option: number) => {
      resizeTo(option);

      callEntries = await screen.findAllByText(FIND_BY);
      expect(callEntries.length).toBe(option);
    });
  });
});
