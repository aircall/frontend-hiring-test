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
    max-height: 100%;
    /**
    * We need to keep overflow-y as scroll to
    * prevent layout shifts.
    *
    * In the future, when it gains better browser support
    * we can use scrollbar-gutter: stable; for this
    */
    overflow-y: scroll;
    scrollbar-color: #707479 transparent;
  }


  ::-webkit-scrollbar {
    display: none;
  }
`;
