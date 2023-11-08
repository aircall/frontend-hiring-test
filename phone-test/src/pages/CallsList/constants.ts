import { Pagination } from '@aircall/tractor';
import { ComponentProps } from 'react';

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
