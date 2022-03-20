import React, { Dispatch, SetStateAction } from 'react';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useEøs } from '../../../../context/EøsContext';
import { IAndreForelder, IBarnMedISøknad } from '../../../../typer/barn';
import { IEøsForBarnFeltTyper } from '../../../../typer/skjema';
import KomponentGruppe from '../../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { IdNummer } from '../IdNummer';
import { idNummerLandMedPeriodeType } from '../idnummerUtils';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from './spørsmål';

const IdNummerForAndreForelder: React.FC<{
    skjema: ISkjema<IEøsForBarnFeltTyper, string>;
    barn: IBarnMedISøknad;
    settIdNummerFelter: Dispatch<SetStateAction<Felt<string>[]>>;
    lesevisning?: boolean;
    andreForelder: IAndreForelder | null;
}> = ({ skjema, barn, settIdNummerFelter, lesevisning = false, andreForelder }) => {
    const { erEøsLand } = useEøs();
    return andreForelder ? (
        <KomponentGruppe>
            {idNummerLandMedPeriodeType(
                {
                    pensjonsperioderUtland: andreForelder.pensjonsperioderUtland,
                    arbeidsperioderUtland: andreForelder.arbeidsperioderUtland,
                },
                erEøsLand
            ).map((landMedPeriodeType, index) => {
                return (
                    !!landMedPeriodeType.land && (
                        <IdNummer
                            key={index}
                            lesevisning={lesevisning}
                            spørsmålSpråkId={
                                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummerAndreForelder]
                            }
                            spørsmålCheckboxSpråkId={
                                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummerUkjent]
                            }
                            feilmeldingSpråkId={'eøs-om-barn.andreforelderidnummer.feilmelding'}
                            idNummerVerdiFraSøknad={
                                andreForelder?.idNummer.find(
                                    verdi => verdi.land === landMedPeriodeType.land
                                )?.idnummer
                            }
                            skjema={skjema}
                            settIdNummerFelter={settIdNummerFelter}
                            landAlphaCode={landMedPeriodeType.land}
                            periodeType={landMedPeriodeType.periodeType}
                            barn={barn}
                        />
                    )
                );
            })}
        </KomponentGruppe>
    ) : null;
};
export default IdNummerForAndreForelder;
