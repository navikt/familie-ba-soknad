import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --mobile: 420px;
    --tablet: 959px;
    --panel-innhold-bredde: 588px;
  }

  body {
    margin: 0;
    box-sizing: content-box;

    /**
     * Setter eksplisitt font-family slik at google sine fonter blir brukt.
     * nav-frontend-typografi har en rar bug hvor fontene blir utydelige på enkelte
     * nettlesere.
     */
    & * {
      font-family: 'Source Sans Pro', sans-serif;
    }
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
