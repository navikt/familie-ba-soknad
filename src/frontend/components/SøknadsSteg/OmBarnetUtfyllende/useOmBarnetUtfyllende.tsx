import React, { useState } from 'react';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { feil, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import {
    AlternativtDatoSvar,
    barnDataKeySpørsmål,
    DatoMedUkjent,
    IBarnMedISøknad,
} from '../../../typer/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnetSpørsmålsId } from './spørsmål';

export interface IOmBarnetUtvidetFeltTyper {
    institusjonsnavn: string;
    institusjonsadresse: string;
    institusjonspostnummer: string;
    institusjonOppholdStart: ISODateString;
    institusjonOppholdSlutt: DatoMedUkjent;
    institusjonOppholdSluttVetIkke: ESvar;
}

export const useOmBarnetUtfyllende = (
    barnetsIdent: string
): {
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    barn: IBarnMedISøknad;
} => {
    const { søknad, settSøknad } = useApp();

    const [barn] = useState(
        søknad.barnInkludertISøknaden.find(barn => barn.ident === barnetsIdent)
    );

    if (!barn) {
        throw new TypeError('Kunne ikke finne barn som skulle være her');
    }

    const skalFeltetVises = (søknadsdataFelt: barnDataKeySpørsmål) => {
        return barn[søknadsdataFelt].svar === ESvar.JA;
    };

    const institusjonsnavn = useFelt<string>({
        verdi: barn[barnDataKeySpørsmål.institusjonsnavn].svar,
        feltId: barn[barnDataKeySpørsmål.institusjonsnavn].id,
        valideringsfunksjon: felt =>
            felt.verdi && felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'ombarnet.institusjon.navn.feilmelding'} />),
        skalFeltetVises: () => skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
    });

    const institusjonsadresse = useFelt<string>({
        verdi: barn[barnDataKeySpørsmål.institusjonsadresse].svar,
        feltId: barn[barnDataKeySpørsmål.institusjonsadresse].id,
        valideringsfunksjon: felt =>
            felt.verdi && felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'ombarnet.institusjon.adresse.feilmelding'} />),
        skalFeltetVises: () => skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
    });

    const institusjonspostnummer = useFelt<string>({
        verdi: barn[barnDataKeySpørsmål.institusjonspostnummer].svar,
        feltId: barn[barnDataKeySpørsmål.institusjonspostnummer].id,
        valideringsfunksjon: felt =>
            felt.verdi?.length === 4 && Number.parseInt(felt.verdi)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'ombarnet.institusjon.postnummer.feilmelding'} />),
        skalFeltetVises: () => skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
    });

    const institusjonOppholdStart = useDatovelgerFelt(
        barn[barnDataKeySpørsmål.institusjonOppholdStart],
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon)
    );

    const institusjonOppholdSluttVetIkke = useFelt<ESvar>({
        verdi:
            barn[barnDataKeySpørsmål.institusjonOppholdSlutt].svar === 'UKJENT'
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.institusjonOppholdVetIkke,
    });

    const institusjonOppholdSlutt = useDatovelgerFeltMedUkjent(
        barn[barnDataKeySpørsmål.institusjonOppholdSlutt],
        institusjonOppholdSluttVetIkke,
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon)
    );

    const { kanSendeSkjema, skjema, valideringErOk } = useSkjema<IOmBarnetUtvidetFeltTyper, string>(
        {
            felter: {
                institusjonsnavn,
                institusjonsadresse,
                institusjonspostnummer,
                institusjonOppholdStart,
                institusjonOppholdSlutt,
                institusjonOppholdSluttVetIkke,
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
                          institusjonOppholdStart: {
                              ...barn.institusjonOppholdStart,
                              svar: institusjonOppholdStart.verdi,
                          },
                          institusjonOppholdSlutt: {
                              ...barn.institusjonOppholdSlutt,
                              svar:
                                  institusjonOppholdSluttVetIkke.verdi === ESvar.JA
                                      ? AlternativtDatoSvar.UKJENT
                                      : institusjonOppholdStart.verdi,
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
        barn,
    };
};
