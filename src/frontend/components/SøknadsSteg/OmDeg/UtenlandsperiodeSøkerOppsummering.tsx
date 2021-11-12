import React from 'react';

import styled from 'styled-components';

import { Flatknapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { DeleteFilled } from '@navikt/ds-icons';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { IUtenlandsperiode } from '../../../typer/person';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import {
    landLabelSpråkIdsSøker,
    årsakSpråkIdsSøker,
    fraDatoLabelSpråkIdsSøker,
    tilDatoLabelSpråkIdsSøker,
} from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';

const StyledElement = styled(Element)`
    && {
        margin-bottom: 0.5rem;
    }
`;

const Spørsmål: React.FC<{ språkId: string }> = ({ språkId }) => (
    <StyledElement>
        <SpråkTekst id={språkId} />
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

export const UtenlandsperiodeSøkerOppsummering: React.FC<{
    periode: IUtenlandsperiode;
    nummer: number;
    fjernPeriodeCallback: (periode: IUtenlandsperiode) => void;
}> = ({ periode, nummer, fjernPeriodeCallback }) => {
    const [valgtLocale] = useSprakContext();
    const { oppholdsland, utenlandsoppholdÅrsak, oppholdslandFraDato, oppholdslandTilDato } =
        periode;
    const årsak = utenlandsoppholdÅrsak.svar;
    return (
        <PeriodeContainer>
            <Element>
                <SpråkTekst id={'felles.leggtilutenlands.opphold'} values={{ x: nummer }} />
            </Element>
            <Informasjonsbolk>
                <Spørsmål språkId={'modal.beskriveopphold.spm'} />
                <Normaltekst>
                    <SpråkTekst id={årsakSpråkIdsSøker[årsak]} />
                </Normaltekst>
            </Informasjonsbolk>
            <Informasjonsbolk>
                <Spørsmål språkId={landLabelSpråkIdsSøker[årsak]} />
                <Normaltekst>{landkodeTilSpråk(oppholdsland.svar, valgtLocale)}</Normaltekst>
            </Informasjonsbolk>
            {oppholdslandFraDato && (
                <Informasjonsbolk>
                    <Spørsmål språkId={fraDatoLabelSpråkIdsSøker[årsak]} />
                    <Normaltekst>{formaterDato(oppholdslandFraDato.svar)}</Normaltekst>
                </Informasjonsbolk>
            )}
            {oppholdslandTilDato && (
                <Informasjonsbolk>
                    <Spørsmål språkId={tilDatoLabelSpråkIdsSøker[årsak]} />
                    <Normaltekst>{formaterDato(oppholdslandTilDato.svar)}</Normaltekst>
                </Informasjonsbolk>
            )}{' '}
            <SlettKnapp htmlType={'button'} kompakt onClick={() => fjernPeriodeCallback(periode)}>
                <DeleteFilled />
                <span>
                    <SpråkTekst id={'felles.fjernutenlandsopphold.knapp'} />
                </span>
            </SlettKnapp>
        </PeriodeContainer>
    );
};
