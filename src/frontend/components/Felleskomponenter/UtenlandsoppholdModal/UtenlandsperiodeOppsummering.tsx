import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Normaltekst } from 'nav-frontend-typografi';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import { barnetsNavnValue } from '../../../utils/barn';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../utils/visning';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { VedleggNotisTilleggsskjema } from '../VedleggNotis';
import { tilDatoUkjentLabelSpråkId } from './spørsmål';
import {
    fraDatoLabelSpråkId,
    landLabelSpråkId,
    tilDatoLabelSpråkId,
    årsakLabelSpråkId,
    årsakSpråkId,
} from './utenlandsoppholdSpråkUtils';

const EøsNotisWrapper = styled.div`
    margin-bottom: 2rem;
`;

export const UtenlandsperiodeOppsummering: React.FC<{
    periode: IUtenlandsperiode;
    nummer: number;
    fjernPeriodeCallback?: (periode: IUtenlandsperiode) => void;
    erFørsteEøsPeriode?: boolean;
    barn?: IBarnMedISøknad;
}> = ({ periode, nummer, fjernPeriodeCallback, erFørsteEøsPeriode = false, barn }) => {
    const [valgtLocale] = useSprakContext();
    const intl = useIntl();
    const { toggles } = useFeatureToggles();
    const { formatMessage } = intl;
    const { oppholdsland, utenlandsoppholdÅrsak, oppholdslandFraDato, oppholdslandTilDato } =
        periode;
    const årsak = utenlandsoppholdÅrsak.svar;

    const språkPrefix = barn ? 'ombarnet' : 'omdeg';

    const årsakTilEøsInfoSpråkIds: Record<EUtenlandsoppholdÅrsak, string> = {
        [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE]: `${språkPrefix}.flyttetfranorge.eøs-info`,
        [EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE]: `${språkPrefix}.flyttettilnorge.eøs-info`,
        [EUtenlandsoppholdÅrsak.OPPHOLDER_SEG_UTENFOR_NORGE]: `${språkPrefix}.oppholderi.eøs-info`,
        [EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE]: `${språkPrefix}.oppholdti.eøs-info`,
    };

    return (
        <>
            <PeriodeOppsummering
                nummer={nummer}
                tittelSpråkId={'felles.leggtilutenlands.opphold'}
                fjernKnappSpråkId={'felles.fjernutenlandsopphold.knapp'}
                fjernPeriodeCallback={fjernPeriodeCallback && (() => fjernPeriodeCallback(periode))}
                vedleggNotis={
                    !toggles.EØS_KOMPLETT && erFørsteEøsPeriode ? (
                        <EøsNotisWrapper>
                            <VedleggNotisTilleggsskjema
                                språkTekstId={
                                    årsakTilEøsInfoSpråkIds[periode.utenlandsoppholdÅrsak.svar]
                                }
                                språkValues={{
                                    barn: barn ? barnetsNavnValue(barn, intl) : undefined,
                                }}
                            />
                        </EøsNotisWrapper>
                    ) : undefined
                }
            >
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={årsakLabelSpråkId(barn)}
                            values={{ barn: barn ? barnetsNavnValue(barn, intl) : undefined }}
                        />
                    }
                >
                    <Normaltekst>
                        <SpråkTekst
                            id={årsakSpråkId(årsak, barn)}
                            values={{ barn: barn ? barnetsNavnValue(barn, intl) : undefined }}
                        />
                    </Normaltekst>
                </OppsummeringFelt>

                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={landLabelSpråkId(årsak, barn)}
                            values={{ barn: barn ? barnetsNavnValue(barn, intl) : undefined }}
                        />
                    }
                    søknadsvar={landkodeTilSpråk(oppholdsland.svar, valgtLocale)}
                />

                {oppholdslandFraDato && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={fraDatoLabelSpråkId(årsak, barn)}
                                values={{ barn: barn ? barnetsNavnValue(barn, intl) : undefined }}
                            />
                        }
                        søknadsvar={formaterDato(oppholdslandFraDato.svar)}
                    />
                )}

                {oppholdslandTilDato && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={tilDatoLabelSpråkId(årsak, barn)}
                                values={{ barn: barn ? barnetsNavnValue(barn, intl) : undefined }}
                            />
                        }
                        søknadsvar={formaterDatoMedUkjent(
                            oppholdslandTilDato.svar,
                            formatMessage({ id: tilDatoUkjentLabelSpråkId })
                        )}
                    />
                )}
            </PeriodeOppsummering>
        </>
    );
};
