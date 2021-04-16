import React from 'react';

import { renderHook } from '@testing-library/react-hooks';

import { ESvar } from '@navikt/familie-form-elements';

import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { ESivilstand } from '../typer/person';
import { ESøknadstype, initialStateSøknad, ISøknad } from '../typer/søknad';
import { AppProvider, useApp } from './AppContext';

const søknadEtterRespons: ISøknad = {
    ...initialStateSøknad,
    søknadstype: ESøknadstype.ORDINÆR,
    søker: {
        ...initialStateSøknad.søker,
        ident: '12345678910',
        navn: 'Navn navnesen',
        barn: [],
        statsborgerskap: [{ landkode: 'DZA' }],
        adresse: { adressenavn: 'Heiveien 32' },
        sivilstand: { type: ESivilstand.GIFT },
    },
};

describe('erStegUtfyltFraFør', () => {
    let hookResult;

    beforeEach(() => {
        const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
        const { result } = renderHook(() => useApp(), { wrapper });
        hookResult = result;
    });

    test('Skal returnere true dersom siste utfylte steg er det samme som nåværende steg', () => {
        const nåværendeStegIndex = 2;
        const { settSisteUtfylteStegIndex } = hookResult.current;
        settSisteUtfylteStegIndex(2);
        expect(hookResult.current.erStegUtfyltFrafør(nåværendeStegIndex)).toEqual(true);
    });

    test('Skal returnere true dersom siste utfylte steg er etter nåværende steg', () => {
        const nåværendeStegIndex = 2;
        const { settSisteUtfylteStegIndex } = hookResult.current;
        settSisteUtfylteStegIndex(3);
        expect(hookResult.current.erStegUtfyltFrafør(nåværendeStegIndex)).toEqual(true);
    });

    test('Skal returnere false dersom siste utfylte steg er før nåværende steg', () => {
        const nåværendeStegIndex = 2;
        const { settSisteUtfylteStegIndex } = hookResult.current;
        settSisteUtfylteStegIndex(1);
        expect(hookResult.current.erStegUtfyltFrafør(nåværendeStegIndex)).toEqual(false);
    });
});

describe('nullstillSøknadsObject', () => {
    test('Skal nullstille søknadsobjekt bortsett fra person hentet fra backend og søknadstype', () => {
        const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
        const { result } = renderHook(() => useApp(), { wrapper });

        const søknadHalvveisUtfylt: ISøknad = {
            ...søknadEtterRespons,
            erNoenAvBarnaFosterbarn: {
                id: OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn,
                svar: ESvar.JA,
            },
            oppholderBarnSegIInstitusjon: {
                id: OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon,
                svar: ESvar.JA,
            },
            erBarnAdoptertFraUtland: {
                id: OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland,
                svar: ESvar.JA,
            },
            oppholderBarnSegIUtland: {
                id: OmBarnaDineSpørsmålId.oppholderBarnSegIUtland,
                svar: ESvar.JA,
            },
        };

        result.current.settSøknad(søknadHalvveisUtfylt);
        expect(result.current.søknad).toEqual(søknadHalvveisUtfylt);
        result.current.nullstillSøknadsobjekt();
        expect(result.current.søknad).toEqual(søknadEtterRespons);
    });
});

describe('avbrytSøknad', () => {
    test('Ved avbryt skal sisteUtfylteStegIndex settes til -1', () => {
        const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
        const { result } = renderHook(() => useApp(), { wrapper });
        result.current.sisteUtfylteStegIndex = 3;
        result.current.avbrytSøknad();
        expect(result.current.sisteUtfylteStegIndex).toEqual(-1);
    });
});
