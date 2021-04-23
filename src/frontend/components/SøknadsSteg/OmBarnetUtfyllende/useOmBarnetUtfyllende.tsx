import React from 'react';

import { feil, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../typer/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnetSpørsmålsId } from './spørsmål';

export interface IOmBarnetUtvidetFeltTyper {
    institusjonsnavn: string;
    institusjonsadresse: string;
    institusjonspostnummer: string;
    institusjonOppholdStart: string;
    institusjonOppholdSlutt: string;
}

export const useOmBarnetUtfyllende = (
    barnetsIdent: string
): {
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
} => {
    const { søknad, settSøknad } = useApp();

    const finnGjeldendeBarnet = (): IBarnMedISøknad => {
        const barn = søknad.barnInkludertISøknaden.find(barn => barn.ident === barnetsIdent);
        if (!barn) {
            //TODO: håndtering av feil
            throw new TypeError('Kunne ikke finne barn som skulle være her');
        }
        return barn;
    };

    const institusjonsnavn = useFelt<string>({
        verdi: '',
        feltId: OmBarnetSpørsmålsId.institusjonsnavn,
        valideringsfunksjon: felt =>
            felt.verdi && felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'ombarnet.institusjon.navn.feilmelding'} />),
    });

    const institusjonsadresse = useFelt<string>({
        verdi: '',
        feltId: OmBarnetSpørsmålsId.institusjonsnavn,
        valideringsfunksjon: felt =>
            felt.verdi && felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'ombarnet.institusjon.adresse.feilmelding'} />),
    });

    const institusjonspostnummer = useFelt<string>({
        verdi: '',
        feltId: OmBarnetSpørsmålsId.institusjonsnavn,
        valideringsfunksjon: felt =>
            felt.verdi?.length === 4 && Number.parseInt(felt.verdi)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'ombarnet.institusjon.postnummer.feilmelding'} />),
    });

    const institusjonOppholdStart = useDatovelgerFelt(
        finnGjeldendeBarnet()[barnDataKeySpørsmål.institusjonOppholdStart]
    );

    const institusjonOppholdSlutt = useDatovelgerFelt(
        finnGjeldendeBarnet()[barnDataKeySpørsmål.institusjonOppholdSlutt]
    );

    const { kanSendeSkjema, skjema, valideringErOk } = useSkjema<IOmBarnetUtvidetFeltTyper, string>(
        {
            felter: {
                institusjonsnavn,
                institusjonsadresse,
                institusjonspostnummer,
                institusjonOppholdStart,
                institusjonOppholdSlutt,
            },
            skjemanavn: 'om-barnet',
        }
    );

    const oppdaterSøknad = () => {
        const oppdatertBarnInkludertISøknaden: IBarnMedISøknad[] = søknad.barnInkludertISøknaden.map(
            barn =>
                barn.ident === barnetsIdent
                    ? {
                          ...barn,
                          institusjonsnavn: {
                              ...barn.institusjonsnavn,
                              svar: institusjonsnavn.verdi,
                          },
                          institusjonsadresse: {
                              ...barn.institusjonsadresse,
                              svar: institusjonsadresse.verdi,
                          },
                          institusjonspostnummer: {
                              ...barn.institusjonspostnummer,
                              svar: institusjonspostnummer.verdi,
                          },
                      }
                    : barn
        );

        settSøknad({
            ...søknad,
            barnInkludertISøknaden: oppdatertBarnInkludertISøknaden,
        });
    };

    return {
        oppdaterSøknad,
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
    };
};
