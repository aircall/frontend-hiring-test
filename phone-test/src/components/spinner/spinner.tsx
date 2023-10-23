import { Flex } from '@aircall/tractor';
import styled from 'styled-components';

const Spinner = () => (
  <Flex justifyContent="center" alignItems="center" marginTop={10}>
    <StyledSpinner viewBox="0 0 40 40">
      <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
    </StyledSpinner>
  </Flex>
);

const StyledSpinner = styled.svg`
  animation: rotate 2s linear infinite;
  width: 50px;
  height: 50px;

  & .path {
    stroke: #00b388;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;

export default Spinner;
