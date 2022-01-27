import React, { useState } from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, ISkjema, ok, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../../context/AppContext';
import useJaNeiSpmFelt from '../../../../hooks/useJaNeiSpmFelt';
import { usePerioder } from '../../../../hooks/usePerioder';
import { andreForelderDataKeySpørsmål, IBarnMedISøknad } from '../../../../typer/barn';
import { BarnetsId } from '../../../../typer/common';
import { IPensjonsperiode } from '../../../../typer/perioder';
import { IEøsForBarnFeltTyper } from '../../../../typer/skjema';
import { barnetsNavnValue } from '../../../../utils/barn';
import { pensjonsperiodeFeilmelding } from '../../../Felleskomponenter/Pensjonsmodal/språkUtils';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';

export const useEøsForBarn = (
    barnetsUuid: BarnetsId
): {
    skjema: ISkjema<IEøsForBarnFeltTyper, string>;
    barn: IBarnMedISøknad;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    validerAlleSynligeFelter: () => void;
    oppdaterSøknad: () => void;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
} => {
    const { søknad, settSøknad } = useApp();
    const intl = useIntl();

    const [barn] = useState<IBarnMedISøknad | undefined>(
        søknad.barnInkludertISøknaden.find(barn => barn.id === barnetsUuid)
    );

    if (!barn) {
        throw new TypeError('Kunne ikke finne barn som skulle være her');
    }

    /*--- ANDRE FORELDER ---*/
    const andreForelder = barn.andreForelder;

    const andreForelderPensjonNorge = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.pensjonNorge],
        feilmeldingSpråkId:
            barn.andreForelderErDød.svar === ESvar.JA
                ? 'enkeenkemann.andreforelderpensjon.feilmelding'
                : 'eøs-om-barn.andreforelderpensjon.feilmelding',
        feilmeldingSpråkVerdier: { barn: barnetsNavnValue(barn, intl) },
    });

    const {
        fjernPeriode: fjernPensjonsperiode,
        leggTilPeriode: leggTilPensjonsperiode,
        registrertePerioder: andreForelderPensjonsperioderNorge,
    } = usePerioder<IPensjonsperiode>(
        andreForelder?.pensjonsperioderNorge ?? [],
        { andreForelderPensjonNorge },
        avhengigheter => avhengigheter.andreForelderPensjonNorge.verdi === ESvar.JA,
        felt =>
            andreForelderPensjonNorge.verdi === ESvar.JA && felt.verdi.length === 0
                ? feil(felt, <SpråkTekst id={pensjonsperiodeFeilmelding(false)} />)
                : ok(felt)
    );

    const genererOppdatertBarn = (barn: IBarnMedISøknad): IBarnMedISøknad => {
        return {
            ...barn,
            ...(!!barn.andreForelder && {
                andreForelder: {
                    ...barn.andreForelder,
                    pensjonNorge: {
                        ...barn.andreForelder[andreForelderDataKeySpørsmål.pensjonNorge],
                        svar: andreForelderPensjonNorge.verdi,
                    },

                    pensjonsperioderNorge:
                        andreForelderPensjonNorge.verdi === ESvar.JA
                            ? skjema.felter.andreForelderPensjonsperioderNorge.verdi
                            : [],
                },
            }),
        };
    };

    const oppdaterSøknad = () => {
        const oppdatertBarnInkludertISøknaden: IBarnMedISøknad[] =
            søknad.barnInkludertISøknaden.map(barn =>
                barn.id === barnetsUuid ? genererOppdatertBarn(barn) : barn
            );

        settSøknad({
            ...søknad,
            barnInkludertISøknaden: oppdatertBarnInkludertISøknaden,
        });
    };

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IEøsForBarnFeltTyper,
        string
    >({
        felter: { andreForelderPensjonNorge, andreForelderPensjonsperioderNorge },
        skjemanavn: 'eøsForBarn',
    });

    return {
        skjema,
        barn,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        validerAlleSynligeFelter,
        oppdaterSøknad,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
    };
};
