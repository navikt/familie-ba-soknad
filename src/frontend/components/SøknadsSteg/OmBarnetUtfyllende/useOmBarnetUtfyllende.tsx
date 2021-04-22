import React from 'react';

import { feil, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnetUfyllendeSpørsmålsId } from './spørsmål';

export interface IOmBarnetUtvidetFeltTyper {
    [OmBarnetUfyllendeSpørsmålsId.institusjonsnavn]: string;
    [OmBarnetUfyllendeSpørsmålsId.institusjonsadresse]: string;
    [OmBarnetUfyllendeSpørsmålsId.institusjonspostnummer]: string;
}

export const useOmBarnetUtfyllende = (): {
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
} => {
    const institusjonsnavn = useFelt<string>({
        verdi: '',
        feltId: OmBarnetUfyllendeSpørsmålsId.institusjonsnavn,
        valideringsfunksjon: felt =>
            felt.verdi && felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'ombarnet.institusjon.navn.feilmelding'} />),
    });

    const institusjonsadresse = useFelt<string>({
        verdi: '',
        feltId: OmBarnetUfyllendeSpørsmålsId.institusjonsnavn,
        valideringsfunksjon: felt =>
            felt.verdi && felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'ombarnet.institusjon.adresse.feilmelding'} />),
    });

    const institusjonspostnummer = useFelt<string>({
        verdi: '',
        feltId: OmBarnetUfyllendeSpørsmålsId.institusjonsnavn,
        valideringsfunksjon: felt =>
            felt.verdi?.length === 4 && Number.parseInt(felt.verdi)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'ombarnet.institusjon.postnummer.feilmelding'} />),
    });

    const { kanSendeSkjema, skjema, valideringErOk } = useSkjema<IOmBarnetUtvidetFeltTyper, string>(
        {
            felter: {
                institusjonsnavn,
                institusjonsadresse,
                institusjonspostnummer,
            },
            skjemanavn: 'om-barnet',
        }
    );

    const oppdaterSøknad = () => {
        // TODO
    };

    return {
        oppdaterSøknad,
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
    };
};
