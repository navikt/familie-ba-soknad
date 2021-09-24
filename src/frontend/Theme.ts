import { createGlobalStyle, css } from 'styled-components';

import navFarger from 'nav-frontend-core';

export const device = {
    mobile: css`(max-width: 30rem)`,
    tablet: css`(max-width: 52.5rem)`,
};

export const GlobalStyle = createGlobalStyle`
  :root {
    --innhold-bredde: 32.75rem;
    color: ${navFarger.navMorkGra};
    font-family: 'Source Sans Pro', Arial, sans-serif;

    && label,
    legend,
    a,
    p,
    li,
    h2 {
      font-size: 18px;
      line-height: 26px;
    }
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

  #familie-ba-soknad-page-container {
  position: relative;
  min-height: 100vh;
}

  #familie-ba-soknad-content-wrapper {
    padding-bottom: 5.5rem;
  }
  @media screen and (max-width: 950px) {
    #familie-ba-soknad-content-wrapper {
      padding-bottom: 6.875rem;
    }
  }
  @media screen and (max-width: 768px) {
    #familie-ba-soknad-content-wrapper {
      padding-bottom: 12.75rem;
    }
  }

  footer {
    position: absolute;
    bottom: 0;
  }
`;
