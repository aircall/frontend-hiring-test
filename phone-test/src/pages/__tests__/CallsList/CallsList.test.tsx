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
      query: PAGINATED_CALLS,
      variables: {
        offset: (6 - 1) * 5, // Page 6 / Size 5
        limit: 5
      }
    },
    result: {
      data: {
        paginatedCalls: {
          __typename: 'PaginatedCalls',
          nodes: nodesList.slice(30, 35), // From 30 to 35 calls
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
        offset: 0, // Page 1 / Size 25
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
  },
  {
    request: {
      query: PAGINATED_CALLS,
      variables: {
        offset: (2 - 1) * 25, // Page 2 / Size 25
        limit: 25
      }
    },
    result: {
      data: {
        paginatedCalls: {
          __typename: 'PaginatedCalls',
          nodes: nodesList.slice(25, 50), // From 25 to 50 calls
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
        offset: 0, // Page 1 / Size 50
        limit: 50
      }
    },
    result: {
      data: {
        paginatedCalls: {
          __typename: 'PaginatedCalls',
          nodes: nodesList.slice(0, 50), // From 0 to 50 calls
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

  test('Renders just fine', () => {
    expect(() => render(TestingComponent)).not.toThrowError();
  });

  test('Resize list to 25, then to 50', async () => {
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

    for (const option of [25, 50]) {
      resizeTo(option);
      callEntries = await screen.findAllByText(FIND_BY);
      expect(callEntries.length).toBe(option);
    }
  });

  test('Resize list to 25 & keep in page with current calls list', async () => {
    /*
     * Minor wider test to test functionality when paging and resizing list.
     * It will redirect the user to the page with the same calls list
     */
    render(TestingComponent);

    const FIND_BY = /\+33/;
    let prevFirstCallOnList: HTMLElement | undefined = undefined;

    async function compareCallsList() {
      // COMPARE FIRST CALL ON CURRENT AND PREV CALLS LIST
      const firstCallOnList = (await screen.findAllByText(FIND_BY))[0];
      expect(firstCallOnList).not.toBeUndefined();
      expect(prevFirstCallOnList).not.toEqual(firstCallOnList);
      prevFirstCallOnList = firstCallOnList;
      return;
    }
    function findAndClick(selector: string) {
      const element = document.querySelector(selector);
      expect(element).not.toBeNull();
      fireEvent.click(element!);
      return;
    }

    let callEntries = await screen.findAllByText(FIND_BY);
    expect(callEntries.length).toBe(5);

    await compareCallsList();

    // GO TO PAGE 5 AND CONFIRM THAT ITS FIRST CALL IS NOT THE SAME THAN ON PREV PAGE
    findAndClick('[data-test="pagination-page-5"]');
    await compareCallsList();

    // GO TO PAGE 6 AND CONFIRM THAT ITS FIRST CALL IS NOT THE SAME THAN ON PREV PAGE
    findAndClick('[data-test="pagination-page-6"]');
    await compareCallsList();

    const dropdownSelector = document.querySelector('[data-test="select-trigger-container"]');

    if (dropdownSelector) {
      fireEvent.click(dropdownSelector);
      const option = document.querySelector('[data-test="select-option-item-25"]');

      if (option) {
        fireEvent.click(option);
      }
    }

    callEntries = await screen.findAllByText(FIND_BY);
    expect(callEntries.length).toBe(25);
    expect(callEntries).toContainEqual(prevFirstCallOnList);
  });
});
