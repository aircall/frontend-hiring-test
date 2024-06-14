import { Spacer } from '@aircall/tractor';
import styled from 'styled-components';

export const PaginationWrapper = styled.div`
  > div {
    width: inherit;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
`;

export const CallsList = styled(Spacer)`
  height: 500px;
  overflow: auto;
`;
