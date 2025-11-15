import React, { Dispatch, SetStateAction } from 'react';

import type { Felt, ISkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../../context/AppContext';
import { useEøsContext } from '../../../../context/EøsContext';
import { IEøsForSøkerFeltTyper } from '../../../../typer/skjema';
import { IdNummer } from '../IdNummer';
import { idNummerLandMedPeriodeType } from '../idnummerUtils';

import { EøsSøkerSpørsmålId, eøsSøkerSpørsmålSpråkId } from './spørsmål';

interface Props {
    skjema: ISkjema<IEøsForSøkerFeltTyper, string>;
    settIdNummerFelter: Dispatch<SetStateAction<Felt<string>[]>>;
    lesevisning?: boolean;
}

const IdNummerForSøker: React.FC<Props> = ({ lesevisning = false, skjema, settIdNummerFelter }) => {
    const { søknad, tekster } = useAppContext();
    const { søker } = søknad;
    const { arbeidsperioderUtland, pensjonsperioderUtland, utenlandsperioder } = søker;
    const { erEøsLand } = useEøsContext();

    const idNummerSomMåOppgisFraPerioder = idNummerLandMedPeriodeType(
        {
            arbeidsperioderUtland,
            pensjonsperioderUtland,
            utenlandsperioder,
        },
        erEøsLand
    );

    return idNummerSomMåOppgisFraPerioder ? (
        <>
            {idNummerSomMåOppgisFraPerioder.map((landMedPeriodeType, index) => {
                return (
                    !!landMedPeriodeType.land && (
                        <IdNummer
                            spørsmålSpråkId={eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.idNummer]}
                            spørsmålCheckboxSpråkId={eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.idNummerUkjent]}
                            feilmeldingSpråkId={'eøs-om-deg.dittidnummer.feilmelding'}
                            idNummerVerdiFraSøknad={
                                søker.idNummer.find(verdi => verdi.land === landMedPeriodeType.land)?.idnummer
                            }
                            lesevisning={lesevisning}
                            skjema={skjema}
                            key={index}
                            settIdNummerFelter={settIdNummerFelter}
                            landAlphaCode={landMedPeriodeType.land}
                            periodeType={landMedPeriodeType.periodeType}
                            spørsmålDokument={tekster().EØS_FOR_SØKER.idNummer}
                        />
                    )
                );
            })}
        </>
    ) : null;
};

export default IdNummerForSøker;
