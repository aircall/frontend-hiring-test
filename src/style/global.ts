import { createGlobalStyle } from '@xstyled/styled-components';

export const GlobalAppStyle = createGlobalStyle`
  html, body {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  body {
    background-color: background-01;
  }

  #root {
    display: grid;
    place-items: center;
    grid-template-rows: 1fr;
    width: 100vw;
    overflow-y: auto;
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;
