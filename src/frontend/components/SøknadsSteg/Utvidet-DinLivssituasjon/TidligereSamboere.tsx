import React from 'react';

import styled from 'styled-components/macro';

import { Flatknapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';

import { AddCircle } from '@navikt/ds-icons';
import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { DinLivssituasjonSpørsmålId, dinLivssituasjonSpørsmålSpråkId } from './spørsmål';
import { IDinLivssituasjonFeltTyper } from './useDinLivssituasjon';

const StyledFlatKnapp = styled(Flatknapp)`
    margin-top: 0.5rem;
`;

interface Props {
    skjema: ISkjema<IDinLivssituasjonFeltTyper, string>;
}

const TidligereSamboere: React.FC<Props> = ({ skjema }) => {
    return (
        <>
            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.hattAnnenSamboerForSøktPeriode}
                    spørsmålTekstId={
                        dinLivssituasjonSpørsmålSpråkId[
                            DinLivssituasjonSpørsmålId.hattAnnenSamboerForSøktPeriode
                        ]
                    }
                />
            </KomponentGruppe>
            {skjema.felter.hattAnnenSamboerForSøktPeriode.verdi === ESvar.JA && (
                <>
                    <Element>
                        <SpråkTekst
                            id={
                                dinLivssituasjonSpørsmålSpråkId[
                                    DinLivssituasjonSpørsmålId.hattFlereSamboereForSøktPeriode
                                ]
                            }
                        />
                    </Element>
                    <StyledFlatKnapp
                        htmlType={'button'}
                        kompakt
                        onClick={() => {
                            alert('Ikke implementert');
                        }}
                    >
                        <AddCircle />
                        <span>
                            <SpråkTekst id={'omdeg.leggtilfleresamboere.leggtil'} />
                        </span>
                    </StyledFlatKnapp>
                </>
            )}
        </>
    );
};
export default TidligereSamboere;
