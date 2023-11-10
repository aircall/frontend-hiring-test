import { Pagination } from '@aircall/tractor';
import { ComponentProps } from 'react';

/**
 * Note: The filtering feature is limited to the last 200 calls
 * due to the limitations of the paginatedCalls query, which does not support filters.
 *
 * FILTERS_ACTIVE_PAGE and FILTERS_PAGE_SIZE constants will not be needed
 * once the paginatedCalls query supports filters through its arguments
 */
export const FILTERS_ACTIVE_PAGE = 1;
export const FILTERS_PAGE_SIZE = 200;

export const PAGE_SIZE_OPTIONS: ComponentProps<typeof Pagination>['pageSizeOptions'] = [
  {
    value: 5,
    label: '5'
  },
  {
    value: 10,
    label: '10'
  },
  {
    value: 25,
    label: '25'
  },
  {
    value: 50,
    label: '50'
  },
  {
    value: 100,
    label: '100'
  },
  {
    value: 200,
    label: '200'
  }
];
