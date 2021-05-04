import React, { useState } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { feil, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import {
    AlternativtDatoSvar,
    barnDataKeySpørsmål,
    DatoMedUkjent,
    IBarnMedISøknad,
} from '../../../typer/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnetSpørsmålsId } from './spørsmål';
import useDatovelgerFelt from './useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from './useDatovelgerFeltMedUkjent';
import useLanddropdownFelt from './useLanddropdownFelt';

export interface IOmBarnetUtvidetFeltTyper {
    institusjonsnavn: string;
    institusjonsadresse: string;
    institusjonspostnummer: string;
    institusjonOppholdStartdato: ISODateString;
    institusjonOppholdSluttdato: DatoMedUkjent;
    institusjonOppholdSluttVetIkke: ESvar;
    oppholdsland: Alpha3Code | '';
    oppholdslandStartdato: ISODateString;
    oppholdslandSluttdato: DatoMedUkjent;
    oppholdslandSluttDatoVetIkke: ESvar;
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

    /*---INSTITUSJON---*/

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

    const institusjonOppholdStartdato = useDatovelgerFelt(
        barn[barnDataKeySpørsmål.institusjonOppholdStartdato],
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon)
    );

    const institusjonOppholdSluttVetIkke = useFelt<ESvar>({
        verdi:
            barn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar === 'UKJENT'
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.institusjonOppholdVetIkke,
    });

    const institusjonOppholdSluttdato = useDatovelgerFeltMedUkjent(
        barn[barnDataKeySpørsmål.institusjonOppholdSluttdato],
        institusjonOppholdSluttVetIkke,
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon)
    );

    /*---UTENLANDSOPPHOLD---*/

    const oppholdsland = useLanddropdownFelt(
        barn.oppholdsland,
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIUtland)
    );

    const oppholdslandStartdato = useDatovelgerFelt(
        barn[barnDataKeySpørsmål.oppholdslandStartdato],
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIUtland)
    );

    const oppholdslandSluttDatoVetIkke = useFelt<ESvar>({
        verdi:
            barn[barnDataKeySpørsmål.oppholdslandSluttdato].svar === 'UKJENT'
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.oppholdslandSluttDatoVetIkke,
    });

    const oppholdslandSluttdato = useDatovelgerFeltMedUkjent(
        barn[barnDataKeySpørsmål.oppholdslandSluttdato],
        oppholdslandSluttDatoVetIkke,
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIUtland)
    );

    const { kanSendeSkjema, skjema, valideringErOk } = useSkjema<IOmBarnetUtvidetFeltTyper, string>(
        {
            felter: {
                institusjonsnavn,
                institusjonsadresse,
                institusjonspostnummer,
                institusjonOppholdStartdato,
                institusjonOppholdSluttdato,
                institusjonOppholdSluttVetIkke,
                oppholdsland,
                oppholdslandStartdato,
                oppholdslandSluttdato,
                oppholdslandSluttDatoVetIkke,
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
                          institusjonOppholdStartdato: {
                              ...barn.institusjonOppholdStartdato,
                              svar: institusjonOppholdStartdato.verdi,
                          },
                          institusjonOppholdSluttdato: {
                              ...barn.institusjonOppholdSluttdato,
                              svar:
                                  institusjonOppholdSluttVetIkke.verdi === ESvar.JA
                                      ? AlternativtDatoSvar.UKJENT
                                      : institusjonOppholdStartdato.verdi,
                          },
                          oppholdsland: {
                              ...barn.oppholdsland,
                              svar: oppholdsland.verdi,
                          },
                          oppholdslandStartdato: {
                              ...barn.oppholdslandStartdato,
                              svar: oppholdslandStartdato.verdi,
                          },
                          oppholdslandSluttdato: {
                              ...barn.oppholdslandSluttdato,
                              svar:
                                  oppholdslandSluttDatoVetIkke.verdi === ESvar.JA
                                      ? AlternativtDatoSvar.UKJENT
                                      : oppholdslandSluttdato.verdi,
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
