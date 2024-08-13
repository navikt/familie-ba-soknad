import React from 'react';

import { useIntl } from 'react-intl';

import { FormSummary } from '@navikt/ds-react';

import { useSpråk } from '../../../context/SpråkContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../utils/visning';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

import { tilDatoUkjentLabelSpråkId } from './spørsmål';
import {
    fraDatoLabelSpråkId,
    landLabelSpråkId,
    tilDatoLabelSpråkId,
    årsakLabelSpråkId,
    årsakSpråkId,
} from './utenlandsoppholdSpråkUtils';

export const UtenlandsperiodeOppsummeringMedFormSummary: React.FC<{
    periode: IUtenlandsperiode;
    nummer: number;
    fjernPeriodeCallback?: (periode: IUtenlandsperiode) => void;
    barn?: IBarnMedISøknad;
}> = ({ periode, nummer, fjernPeriodeCallback, barn }) => {
    const { valgtLocale } = useSpråk();
    const intl = useIntl();
    const { formatMessage } = intl;
    const { oppholdsland, utenlandsoppholdÅrsak, oppholdslandFraDato, oppholdslandTilDato } =
        periode;
    const årsak = utenlandsoppholdÅrsak.svar;

    return (
        <PeriodeOppsummering
            nummer={nummer}
            tittelSpråkId={'felles.leggtilutenlands.opphold'}
            fjernKnappSpråkId={'felles.fjernutenlandsopphold.knapp'}
            fjernPeriodeCallback={fjernPeriodeCallback && (() => fjernPeriodeCallback(periode))}
        >
            <FormSummary.Answer>
                <FormSummary.Label>
                    <SpråkTekst
                        id={årsakLabelSpråkId(barn)}
                        values={{ barn: barn ? barn.navn : undefined }}
                    />
                </FormSummary.Label>
                <FormSummary.Value>
                    <SpråkTekst
                        id={årsakSpråkId(årsak, barn)}
                        values={{ barn: barn ? barn.navn : undefined }}
                    />
                </FormSummary.Value>
            </FormSummary.Answer>

            <FormSummary.Answer>
                <FormSummary.Label>
                    <SpråkTekst
                        id={landLabelSpråkId(årsak, barn)}
                        values={{ barn: barn ? barn.navn : undefined }}
                    />
                </FormSummary.Label>
                <FormSummary.Value>
                    {landkodeTilSpråk(oppholdsland.svar, valgtLocale)}
                </FormSummary.Value>
            </FormSummary.Answer>

            {oppholdslandFraDato && (
                <FormSummary.Answer>
                    <FormSummary.Label>
                        <SpråkTekst
                            id={fraDatoLabelSpråkId(årsak, barn)}
                            values={{ barn: barn ? barn.navn : undefined }}
                        />
                    </FormSummary.Label>
                    <FormSummary.Value>{formaterDato(oppholdslandFraDato.svar)}</FormSummary.Value>
                </FormSummary.Answer>
            )}

            {oppholdslandTilDato && (
                <FormSummary.Answer>
                    <FormSummary.Label>
                        <SpråkTekst
                            id={tilDatoLabelSpråkId(årsak, barn)}
                            values={{ barn: barn ? barn.navn : undefined }}
                        />
                    </FormSummary.Label>
                    <FormSummary.Value>
                        {formaterDatoMedUkjent(
                            oppholdslandTilDato.svar,
                            formatMessage({ id: tilDatoUkjentLabelSpråkId })
                        )}
                    </FormSummary.Value>
                </FormSummary.Answer>
            )}
        </PeriodeOppsummering>
    );
};
