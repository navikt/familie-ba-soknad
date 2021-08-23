import React, { useEffect, useState } from 'react';

import styled from 'styled-components/macro';

import { Flatknapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';

import { AddCircle } from '@navikt/ds-icons';
import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { ITidligereSamboer } from '../../../typer/person';
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
    const [tidligereSamboere, settTidligereSamboere] = useState<ITidligereSamboer[]>([]);

    useEffect(() => {
        if (skjema.felter.hattAnnenSamboerForSøktPeriode.verdi === ESvar.NEI) {
            settTidligereSamboere([]);
        } else {
            populerInitiellTidligereSamboerListe();
        }
    }, [skjema.felter.hattAnnenSamboerForSøktPeriode.verdi]);

    const populerInitiellTidligereSamboerListe = () => {
        settTidligereSamboere([nySamboer()]);
    };

    const nySamboer = (): ITidligereSamboer => {
        return {
            fødselsdato: { id: '', svar: '' },
            ident: { id: '', svar: '' },
            navn: { id: '', svar: 'navn' },
            samboerFraDato: { id: '', svar: '' },
            samboerTilDato: { id: '', svar: '' },
        };
    };

    const leggTilTidligereSamboer = () => {
        settTidligereSamboere(prevState => prevState.concat(nySamboer()));
    };

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
                <div aria-live={'polite'}>
                    {tidligereSamboere.map((samboer: ITidligereSamboer, index: number) => (
                        <div key={index}>
                            DETTE ER EN TIDLIGERE SAMBOER NUMMER {index} med navn
                            {samboer.navn.svar}
                        </div>
                    ))}

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
                            leggTilTidligereSamboer();
                        }}
                    >
                        <AddCircle />
                        <span>
                            <SpråkTekst id={'omdeg.leggtilfleresamboere.leggtil'} />
                        </span>
                    </StyledFlatKnapp>
                </div>
            )}
        </>
    );
};
export default TidligereSamboere;
