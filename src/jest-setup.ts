import '@testing-library/jest-dom';
import IntlPolyfill from 'intl';

window.scrollTo = () => {
    // Ikke implementert
};

process.env.BASE_PATH = '/';
global.Intl = IntlPolyfill;
