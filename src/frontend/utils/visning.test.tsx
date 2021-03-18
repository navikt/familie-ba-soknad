import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { LocaleType } from '@navikt/familie-sprakvelger';

import { ESøknadstype } from '../typer/søknad';
import { SpråkTekst, visLabelOgSvar } from './visning';

test(`Test at rendrer både label og svar`, () => {
    const { getByText } = render(
        <div>{visLabelOgSvar({ label: 'TestLabel', verdi: 'TestVerdi' }, '2rem')}</div>
    );

    expect(getByText(/TestLabel/)).toBeInTheDocument();
    expect(getByText(/TestVerdi/)).toBeInTheDocument();
});

test(`Test at rendrer ESøknadstype`, () => {
    const { getByText } = render(
        <div>{visLabelOgSvar({ label: 'TestLabel', verdi: ESøknadstype.ORDINÆR }, '1rem')}</div>
    );
    expect(getByText(/Ordinær/)).toBeInTheDocument();
});

test(`Test at kjente tags rendrer i språkkomponent`, () => {
    const tekster = {
        testtekst: 'Dette er en test. {linjeskift} <b>Fet</b>',
    };

    render(
        <IntlProvider locale={LocaleType.nb} messages={tekster}>
            <SpråkTekst id={'testtekst'} />
        </IntlProvider>
    );

    ['b', 'br'].forEach(støttaTag => expect(document.querySelector(støttaTag)).toBeInTheDocument());
});

test(`Test at ekstra tags kan legges til språkkomponent via props`, () => {
    const tekster = {
        testtekst: 'Dette er en test. {linjeskift} <b>Fet</b> <em>Kursiv</em>',
    };

    render(
        <IntlProvider locale={LocaleType.nb} messages={tekster}>
            <SpråkTekst
                id={'testtekst'}
                values={{
                    em: tekst => <em>{tekst}</em>,
                }}
            />
        </IntlProvider>
    );

    ['b', 'br', 'em'].forEach(støttaTag =>
        expect(document.querySelector(støttaTag)).toBeInTheDocument()
    );
});
