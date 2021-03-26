import React from 'react';

import { FormattedMessage } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { IBarn } from '../../../typer/person';

export enum OmBarnetUfyllendeSpørsmålsId {
    institusjonsnavn = 'institusjonsnavn',
    institusjonsadresse = 'institusjonsadresse',
    institusjonspostnummer = 'institusjonspostnummer',
}

export const OmBarnetUfyllendeSpørsmålSpråkId: Record<OmBarnetUfyllendeSpørsmålsId, string> = {
    [OmBarnetUfyllendeSpørsmålsId.institusjonsnavn]: 'ombarnet-utfyllende.spm.institusjonsnavn',
    [OmBarnetUfyllendeSpørsmålsId.institusjonsadresse]:
        'ombarnet-utfyllende.spm.institusjonsadresse',
    [OmBarnetUfyllendeSpørsmålsId.institusjonspostnummer]:
        'ombarnet-utfyllende.spm.institusjonspostnummer',
};

export interface IOmBarnetUtvidetFeltTyper {
    [OmBarnetUfyllendeSpørsmålsId.institusjonsnavn]: string | undefined;
    [OmBarnetUfyllendeSpørsmålsId.institusjonsadresse]: string | undefined;
    [OmBarnetUfyllendeSpørsmålsId.institusjonspostnummer]: string | undefined;
}

export const useOmBarnetUtfyllende = (
    barn: IBarn
): {
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
} => {
    const { oppholderSegIInstitusjon } = barn;

    const institusjonsnavn = useFelt<string | undefined>({
        verdi: undefined,
        feltId: OmBarnetUfyllendeSpørsmålsId.institusjonsnavn,
        valideringsfunksjon: felt =>
            felt.verdi && felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <FormattedMessage id={'ombarnet.feil.måfylleinninstitusjonsnavn'} />),
        skalFeltetVises: ({ oppholderSegIInstitusjon }) =>
            oppholderSegIInstitusjon.svar === ESvar.JA,
        avhengigheter: { oppholderSegIInstitusjon },
    });

    const institusjonsadresse = useFelt<string | undefined>({
        verdi: undefined,
        valideringsfunksjon: felt =>
            felt.verdi && felt.verdi !== ''
                ? ok(felt)
                : feil(
                      felt,
                      <FormattedMessage id={'ombarnet.feil.måfylleinninstitusjonpostnummer'} />
                  ),
        feltId: OmBarnetUfyllendeSpørsmålsId.institusjonsnavn,
        skalFeltetVises: ({ oppholderSegIInstitusjon }) =>
            oppholderSegIInstitusjon.svar === ESvar.JA,
        avhengigheter: { oppholderSegIInstitusjon },
    });

    const institusjonspostnummer = useFelt<string | undefined>({
        verdi: undefined,
        feltId: OmBarnetUfyllendeSpørsmålsId.institusjonsnavn,
        valideringsfunksjon: felt =>
            felt.verdi?.length === 4 && Number.parseInt(felt.verdi)
                ? ok(felt)
                : feil(
                      felt,
                      <FormattedMessage id={'ombarnet.feil.måfylleinninstitusjonadresse'} />
                  ),
        skalFeltetVises: ({ oppholderSegIInstitusjon }) =>
            oppholderSegIInstitusjon.svar === ESvar.JA,
        avhengigheter: { oppholderSegIInstitusjon },
    });

    const { kanSendeSkjema, skjema, valideringErOk } = useSkjema<IOmBarnetUtvidetFeltTyper, string>(
        {
            felter: {
                institusjonsnavn,
                institusjonsadresse,
                institusjonspostnummer,
            },
            skjemanavn: barn.ident,
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
