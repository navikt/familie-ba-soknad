import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Flatknapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { DeleteFilled } from '@navikt/ds-icons';
import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { IPensjonsperiode } from '../../../typer/person';
import { IBarnMedISøknad } from '../../../typer/søknad';
import { barnetsNavnValue } from '../../../utils/barn';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { jaNeiSvarTilSpråkId } from '../../../utils/spørsmål';
import Informasjonsbolk from '../Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import {
    fraDatoSpmSpråkId,
    mottarNåSpmSpråkId,
    pensjonslandSpmSpråkId,
    tilDatoSpørsmålSpråkId,
} from './pensjonSpråkUtils';

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
    border-bottom: 1px solid #78706a; ;
`;

const SlettKnapp = styled(Flatknapp)`
    margin-top: 1rem;
    margin-bottom: 1.5rem;
`;

export const PensjonOppsummering: React.FC<{
    periode: IPensjonsperiode;
    nummer: number;
    fjernPeriodeCallback: (periode: IPensjonsperiode) => void;
    barn?: IBarnMedISøknad;
    visFjernKnapp?: boolean;
    className?: string;
}> = ({ periode, nummer, fjernPeriodeCallback, barn, visFjernKnapp = true, className }) => {
    const [valgtLocale] = useSprakContext();
    const intl = useIntl();
    const { mottarPensjonNå, pensjonsland, pensjonFra, pensjonTil } = periode;

    const mottarNå = mottarPensjonNå.svar === ESvar.JA;

    return (
        <PeriodeContainer className={className}>
            <Element>
                <SpråkTekst id={'felles.leggtilutenlands.opphold'} values={{ x: nummer }} />
            </Element>
            <Informasjonsbolk>
                <Spørsmål
                    språkId={mottarNåSpmSpråkId(barn)}
                    språkValues={{ barn: barn ? barnetsNavnValue(barn, intl) : undefined }}
                />
                <Normaltekst>
                    <SpråkTekst
                        id={jaNeiSvarTilSpråkId(mottarPensjonNå.svar)}
                        values={{ barn: barn ? barnetsNavnValue(barn, intl) : undefined }}
                    />
                </Normaltekst>
            </Informasjonsbolk>
            <Informasjonsbolk>
                <Spørsmål
                    språkId={pensjonslandSpmSpråkId(mottarNå, barn)}
                    språkValues={{ barn: barn ? barnetsNavnValue(barn, intl) : undefined }}
                />
                <Normaltekst>{landkodeTilSpråk(pensjonsland.svar, valgtLocale)}</Normaltekst>
            </Informasjonsbolk>
            {pensjonFra?.svar && (
                <Informasjonsbolk>
                    <Spørsmål
                        språkId={fraDatoSpmSpråkId(mottarNå, barn)}
                        språkValues={{ barn: barn ? barnetsNavnValue(barn, intl) : undefined }}
                    />
                    <Normaltekst>{formaterDato(pensjonFra.svar)}</Normaltekst>
                </Informasjonsbolk>
            )}
            {pensjonTil?.svar && (
                <Informasjonsbolk>
                    <Spørsmål
                        språkId={tilDatoSpørsmålSpråkId}
                        språkValues={{ barn: barn ? barnetsNavnValue(barn, intl) : undefined }}
                    />
                    <Normaltekst>{formaterDato(pensjonTil.svar)}</Normaltekst>
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
        </PeriodeContainer>
    );
};
