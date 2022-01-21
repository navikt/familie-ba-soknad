import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Flatknapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { DeleteFilled } from '@navikt/ds-icons';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import { barnetsNavnValue } from '../../../utils/barn';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../utils/visning';
import Informasjonsbolk from '../Informasjonsbolk/Informasjonsbolk';
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

const StyledElement = styled(Element)`
    && {
        margin-bottom: 0.5rem;
    }
`;

const Spørsmål: React.FC<{ språkId: string; språkValues?: Record<string, ReactNode> }> = ({
    språkId,
    språkValues = {},
}) => (
    <StyledElement>
        <SpråkTekst id={språkId} values={språkValues} />
    </StyledElement>
);

const PeriodeContainer = styled.div`
    margin: 2rem 0;
    border-bottom: 1px solid #78706a; // TODO: Bytt til riktig nav farge og bruk variabel
`;

const SlettKnapp = styled(Flatknapp)`
    margin-top: 1rem;
    margin-bottom: 1.5rem;
`;

const EøsNotisWrapper = styled.div`
    margin-bottom: 2rem;
`;

export const UtenlandsperiodeOppsummering: React.FC<{
    periode: IUtenlandsperiode;
    nummer: number;
    fjernPeriodeCallback: (periode: IUtenlandsperiode) => void;
    erFørsteEøsPeriode?: boolean;
    barn?: IBarnMedISøknad;
    visFjernKnapp?: boolean; // TODO: Fjern denne og sjekk på fjernPeriodeCallback. Og gjør fjernPeriodeCallback optional
    className?: string;
}> = ({
    periode,
    nummer,
    fjernPeriodeCallback,
    erFørsteEøsPeriode = false,
    barn,
    visFjernKnapp = true,
    className,
}) => {
    const [valgtLocale] = useSprakContext();
    const intl = useIntl();
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
        <PeriodeContainer className={className}>
            <Element>
                <SpråkTekst id={'felles.leggtilutenlands.opphold'} values={{ x: nummer }} />
            </Element>
            <Informasjonsbolk>
                <Spørsmål
                    språkId={årsakLabelSpråkId(barn)}
                    språkValues={{ barn: barn ? barnetsNavnValue(barn, intl) : undefined }}
                />
                <Normaltekst>
                    <SpråkTekst
                        id={årsakSpråkId(årsak, barn)}
                        values={{ barn: barn ? barnetsNavnValue(barn, intl) : undefined }}
                    />
                </Normaltekst>
            </Informasjonsbolk>
            <Informasjonsbolk>
                <Spørsmål
                    språkId={landLabelSpråkId(årsak, barn)}
                    språkValues={{ barn: barn ? barnetsNavnValue(barn, intl) : undefined }}
                />
                <Normaltekst>{landkodeTilSpråk(oppholdsland.svar, valgtLocale)}</Normaltekst>
            </Informasjonsbolk>
            {oppholdslandFraDato && (
                <Informasjonsbolk>
                    <Spørsmål
                        språkId={fraDatoLabelSpråkId(årsak, barn)}
                        språkValues={{ barn: barn ? barnetsNavnValue(barn, intl) : undefined }}
                    />
                    <Normaltekst>{formaterDato(oppholdslandFraDato.svar)}</Normaltekst>
                </Informasjonsbolk>
            )}
            {oppholdslandTilDato && (
                <Informasjonsbolk>
                    <Spørsmål
                        språkId={tilDatoLabelSpråkId(årsak, barn)}
                        språkValues={{ barn: barn ? barnetsNavnValue(barn, intl) : undefined }}
                    />
                    <Normaltekst>
                        {formaterDatoMedUkjent(
                            oppholdslandTilDato.svar,
                            formatMessage({ id: tilDatoUkjentLabelSpråkId })
                        )}
                    </Normaltekst>
                </Informasjonsbolk>
            )}
            {visFjernKnapp && (
                <SlettKnapp
                    htmlType={'button'}
                    kompakt
                    onClick={() => fjernPeriodeCallback(periode)}
                >
                    <DeleteFilled />
                    <span>
                        <SpråkTekst id={'felles.fjernutenlandsopphold.knapp'} />
                    </span>
                </SlettKnapp>
            )}
            {erFørsteEøsPeriode && (
                <EøsNotisWrapper>
                    <VedleggNotisTilleggsskjema
                        språkTekstId={årsakTilEøsInfoSpråkIds[periode.utenlandsoppholdÅrsak.svar]}
                        språkValues={{ barn: barn ? barnetsNavnValue(barn, intl) : undefined }}
                    />
                </EøsNotisWrapper>
            )}
        </PeriodeContainer>
    );
};
