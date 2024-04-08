import React from 'react';
import styled from 'styled-components';

export const LoaderWrapper = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > span.loader {
    display: block;
    width: 48px;
    height: 48px;
    border: 5px solid #fff;
    border-bottom-color: #29b388;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  > span.loader-message {
    display: block;
    width: 100%;
    text-align: center;
    padding: 20px;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = (props: LoaderProps): React.ReactElement => {
  const { message = 'Loading...' } = props;

  return (
    <LoaderWrapper>
      <span className="loader"></span>
      <span className="loader-message">{message}</span>
    </LoaderWrapper>
  );
};

export default Loader;
