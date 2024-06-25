import React from 'react';

import styled from 'styled-components';

import { Label } from '@navikt/ds-react';

import { ITidligereSamboer } from '../../../typer/person';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Tilleggsinformasjon from '../../Felleskomponenter/Tilleggsinformasjon';
import { useApp } from '../../../context/AppContext';

import LeggTilSamboerModal from './LeggTilSamboerModal';
import SamboerOpplysninger from './SamboerOpplysninger';
import { DinLivssituasjonSpørsmålId, dinLivssituasjonSpørsmålSpråkId } from './spørsmål';

interface Props {
    leggTilTidligereSamboer: (samboer: ITidligereSamboer) => void;
    tidligereSamboere: ITidligereSamboer[];
    fjernTidligereSamboer: (samboer: ITidligereSamboer) => void;
}

const StyledLabel = styled(Label)`
    && {
        margin-bottom: 0.5rem;
    }
`;

const Spørsmål: React.FC<{ språkId: string }> = ({ språkId }) => (
    <StyledLabel forwardedAs="p">
        <SpråkTekst id={språkId} />
    </StyledLabel>
);

const TidligereSamboere: React.FC<Props> = ({
    leggTilTidligereSamboer,
    tidligereSamboere,
    fjernTidligereSamboer,
}) => {
    const { tekster, plainTekst } = useApp();
    const {
        lukkModal: lukkLeggTilSamboerModal,
        åpneModal: åpneLeggTilSamboerModal,
        erÅpen: erLeggTilSamboerModalÅpen,
    } = useModal();

    /* 
    TODO:  
    1. Lag generisk funksjonalitet for å finne hjelpetekst basert på periodetype (f.eks. arbeidsperiode), antall perioder (f.eks. registrerteArbeidsperioder.verdi.length).
    2. Feature toggle for å bytte mellom visning av hjelpetekst gjennom LeggTilKnapp vs bruk av Label over LeggTilKnapp.
    */
    let leggTilPeriodeKnappHjelpetekst: string | undefined = undefined;

    try {
        /* De fleste andre steder brukes tidligereSamboere[personType], skal det her da stå søker istedet? */
        const modal = tekster()['FELLES'].modaler.tidligereSamboere.søker;
        leggTilPeriodeKnappHjelpetekst =
            tidligereSamboere.length === 0
                ? plainTekst(modal.leggTilPeriodeKnappHjelpetekst)
                : plainTekst(modal.flerePerioder);
    } catch (error) {
        console.error('Kunne ikke "Legg til periode-knapp hjelpetekst"', error);
    }

    return (
        <>
            <Spørsmål
                språkId={
                    dinLivssituasjonSpørsmålSpråkId[
                        DinLivssituasjonSpørsmålId.hattAnnenSamboerForSøktPeriode
                    ]
                }
            />
            <Tilleggsinformasjon>
                {tidligereSamboere?.map((samboer: ITidligereSamboer, index: number) => (
                    <SamboerOpplysninger
                        key={index}
                        samboer={samboer}
                        fjernTidligereSamboer={fjernTidligereSamboer}
                    />
                ))}
                <LeggTilKnapp
                    språkTekst="omdeg.leggtilfleresamboere.leggtil"
                    hjelpetekst={leggTilPeriodeKnappHjelpetekst}
                    onClick={åpneLeggTilSamboerModal}
                />
            </Tilleggsinformasjon>
            {erLeggTilSamboerModalÅpen && (
                <LeggTilSamboerModal
                    leggTilTidligereSamboer={leggTilTidligereSamboer}
                    lukkModal={lukkLeggTilSamboerModal}
                    erÅpen={erLeggTilSamboerModalÅpen}
                    hjelpetekst={leggTilPeriodeKnappHjelpetekst}
                />
            )}
        </>
    );
};
export default TidligereSamboere;
