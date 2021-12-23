import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Flatknapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { DeleteFilled } from '@navikt/ds-icons';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { IArbeidsperiode } from '../../../typer/person';
import Informasjonsbolk from '../Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { ArbeidsperiodeSpørsmålsId, arbeidsperiodeSpørsmålSpråkId } from './spørsmål';

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

export const ArbeidsperioderOppsummering: React.FC<{
    periode: IArbeidsperiode;
    nummer: number;
    fjernPeriodeCallback: (periode: IArbeidsperiode) => void;
    visFjernKnapp?: boolean;
    className?: string;
}> = ({ periode, nummer, fjernPeriodeCallback, visFjernKnapp = true, className }) => {
    const [valgtLocale] = useSprakContext();
    const intl = useIntl();
    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeland,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
    } = periode;

    return (
        <PeriodeContainer className={className}>
            <Element>
                <SpråkTekst id={'felles.leggtilutenlands.opphold'} values={{ x: nummer }} />
            </Element>
            <Informasjonsbolk>
                <Spørsmål
                    språkId={
                        arbeidsperiodeSpørsmålSpråkId[
                            ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet
                        ]
                    }
                />
            </Informasjonsbolk>
            {visFjernKnapp && (
                <SlettKnapp
                    htmlType={'button'}
                    kompakt
                    onClick={() => fjernPeriodeCallback(periode)}
                >
                    <DeleteFilled />
                    <span>
                        <SpråkTekst id={'felles.fjernarbeidsperiode.knapp'} />
                    </span>
                </SlettKnapp>
            )}
        </PeriodeContainer>
    );
};

export const BorderlessPensjonOppsummering = styled(ArbeidsperioderOppsummering)`
    border: none;
`;
