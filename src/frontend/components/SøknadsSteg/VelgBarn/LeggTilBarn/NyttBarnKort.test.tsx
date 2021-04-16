import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { HttpProvider } from '@navikt/familie-http';
import * as fnrvalidator from '@navikt/fnrvalidator';

import * as appContext from '../../../../context/AppContext';
import { silenceConsoleErrors } from '../../../../utils/testing';
import { NyttBarnKort } from './NyttBarnKort';

silenceConsoleErrors();

jest.mock('../../../../context/AppContext');
jest.mock('@navikt/fnrvalidator');

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as object),
    useLocation: () => ({
        pathname: 'localhost:3000/velg-barn/',
    }),
}));

test(`Kan legge til barn`, () => {
    const submitMock = jest.fn();
    jest.spyOn(appContext, 'useApp').mockImplementation(
        jest.fn().mockReturnValue({
            søknad: { barnRegistrertManuelt: [] },
            settSøknad: submitMock,
        })
    );
    jest.spyOn(fnrvalidator, 'idnr').mockReturnValue({ status: 'valid', type: 'fnr' });

    const { getByRole, getByText, getByLabelText } = render(
        <IntlProvider locale={'nb'}>
            <HttpProvider>
                <NyttBarnKort />
            </HttpProvider>
        </IntlProvider>
    );

    const leggTilBarnKort = getByRole('button');
    expect(leggTilBarnKort).toBeInTheDocument();
    act(() => leggTilBarnKort.click());

    const modal = getByLabelText('leggtilbarn.popup.label');
    const leggTilKnappIModal = modal.querySelector('button');
    expect(leggTilKnappIModal).toBeInTheDocument();
    expect(leggTilKnappIModal).toHaveClass('knapp--standard');

    const erFødt = getByText('leggtilbarn.er-barnet-født');
    expect(erFødt).toBeInTheDocument();

    // Språktekst-id for Ja er 'ja'
    const jaKnapp = getByText('ja');
    act(() => jaKnapp.click());

    const navnLabel = getByText('leggtilbarn.barnets-navn');
    const idnrLabel = getByText('leggtilbarn.fødselsnummer');
    expect(navnLabel).toBeInTheDocument();
    expect(idnrLabel).toBeInTheDocument();
    const navnInput = navnLabel.nextElementSibling || new Element();
    const idnrInput = idnrLabel.nextElementSibling || new Element();

    act(() => {
        fireEvent.input(navnInput, { target: { value: 'Sirius Svaart' } });
        fireEvent.input(idnrInput, { target: { value: '031159123456' } });
    });

    expect(leggTilKnappIModal).toHaveClass('knapp--hoved');
    act(() => leggTilKnappIModal?.click());

    expect(modal).not.toBeInTheDocument();
    expect(submitMock.mock.calls.length).toBe(1);
});
