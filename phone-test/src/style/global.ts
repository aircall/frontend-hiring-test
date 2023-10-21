import { createGlobalStyle } from '@xstyled/styled-components';

export const GlobalAppStyle = createGlobalStyle`
  html, body {
    height: 100%;
    overflow: hidden;
    width: 100%;
  }

  body {
    background-color: background-01;
  }

  #root {
    display: grid;
    grid-template-rows: 1fr;
    overflow-y: auto;
    place-items: center;
    width: 100vw;
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;
