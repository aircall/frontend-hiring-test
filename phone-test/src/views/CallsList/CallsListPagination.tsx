import { Pagination } from '@aircall/tractor';
import styled from 'styled-components';

export const PaginationWrapper = styled.div`
  > div {
    width: inherit;
    display: flex;
    justify-content: space-between;
    > div:nth-of-type(2) {
      display: flex;
      flex: 1;
      > div {
        display: flex;
        justify-content: space-between;
        flex: 1;
      }
    }
  }
`;

interface CallsListPaginationProps {
  itemsPerPage: number;
  recordsTotalCount: number;
  activePage: number;
  onPageChange: (page: number) => void;
}

const CallsListPagination = ({
  itemsPerPage,
  recordsTotalCount,
  activePage,
  onPageChange
}: CallsListPaginationProps) => {
  return itemsPerPage ? (
    <PaginationWrapper>
      <Pagination
        activePage={activePage}
        pageSize={itemsPerPage}
        onPageChange={onPageChange}
        recordsTotalCount={recordsTotalCount}
      />
    </PaginationWrapper>
  ) : null;
};

export { CallsListPagination };
