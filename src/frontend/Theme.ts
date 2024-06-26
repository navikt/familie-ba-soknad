import { createGlobalStyle, css } from 'styled-components';

import { AGray900 } from '@navikt/ds-tokens/dist/tokens';

export const device = {
    mobile: css`(max-width: 30rem)`,
    tablet: css`(max-width: 52.5rem)`,
};

export const GlobalStyle = createGlobalStyle`
  :root {
    --innhold-bredde: 32.75rem;
    color: ${AGray900};
    font-family: 'Source Sans Pro', Arial, sans-serif;

    && label,
    legend,
    a,
    p,
    li {
      font-size: 1.125rem;
      line-height: 1.625rem;
    }
  }

  body {
    margin: 0;
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
