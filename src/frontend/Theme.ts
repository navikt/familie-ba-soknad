import { createGlobalStyle, css } from 'styled-components';

export const device = {
    mobile: css`(max-width: 420px)`,
    tablet: css`(max-width: 959px)`,
};

export const GlobalStyle = createGlobalStyle`
  :root {
    --innhold-bredde: 524px;
  }

  body {
    margin: 0;
    box-sizing: content-box;
  }

  .blur {
    filter: blur(12px);
    -webkit-filter: blur(12px);
    pointer-events: none;
  }

  footer {
    position: fixed;
    bottom: 0;
    z-index: 1;
  }
`;
