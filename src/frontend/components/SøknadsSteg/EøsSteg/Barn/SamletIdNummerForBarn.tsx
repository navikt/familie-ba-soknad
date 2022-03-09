import React, { Dispatch, SetStateAction } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useEøs } from '../../../../context/EøsContext';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../../typer/barn';
import { IEøsForBarnFeltTyper } from '../../../../typer/skjema';
import { skalSpørreOmIdNummerForPågåendeSøknadEøsLand } from '../../../../utils/barn';
import KomponentGruppe from '../../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { IdNummer } from '../IdNummer';
import { idNummerLandMedPeriodeType, PeriodeType } from '../idnummerUtils';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from './spørsmål';

const IdNummerForBarn: React.FC<{
    landAlphaCode: Alpha3Code | '';
    periodeType?: PeriodeType;
    skjema: ISkjema<IEøsForBarnFeltTyper, string>;
    barn: IBarnMedISøknad;
    settIdNummerFelter: Dispatch<SetStateAction<Felt<string>[]>>;
    lesevisning: boolean;
}> = ({
    landAlphaCode,
    skjema,
    barn,
    settIdNummerFelter,
    periodeType = undefined,
    lesevisning,
}) => {
    return (
        <IdNummer
            lesevisning={lesevisning}
            spørsmålSpråkId={eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummer]}
            spørsmålCheckboxSpråkId={eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummerUkjent]}
            feilmeldingSpråkId={'eøs-om-barn.barnidnummer.feilmelding'}
            idNummerVerdiFraSøknad={
                barn.idNummer.find(verdi => verdi.land === landAlphaCode)?.idnummer
            }
            skjema={skjema}
            settIdNummerFelter={settIdNummerFelter}
            landAlphaCode={landAlphaCode}
            periodeType={periodeType}
            barn={barn}
        />
    );
};

const SamletIdNummerForBarn: React.FC<{
    skjema: ISkjema<IEøsForBarnFeltTyper, string>;
    barn: IBarnMedISøknad;
    settIdNummerFelter: Dispatch<SetStateAction<Felt<string>[]>>;
    lesevisning?: boolean;
}> = ({ barn, skjema, settIdNummerFelter, lesevisning = false }) => {
    const { erEøsLand } = useEøs();
    return (
        <KomponentGruppe>
            {idNummerLandMedPeriodeType(
                {
                    utenlandsperioder: barn.utenlandsperioder,
                    eøsBarnetrygdsperioder: barn.eøsBarnetrygdsperioder,
                },
                erEøsLand
            ).map((landMedPeriodeType, index) => {
                return (
                    !!landMedPeriodeType.land && (
                        <IdNummerForBarn
                            lesevisning={lesevisning}
                            skjema={skjema}
                            key={index}
                            settIdNummerFelter={settIdNummerFelter}
                            landAlphaCode={landMedPeriodeType.land}
                            periodeType={landMedPeriodeType.periodeType}
                            barn={barn}
                        />
                    )
                );
            })}
            {skalSpørreOmIdNummerForPågåendeSøknadEøsLand(barn, erEøsLand) && (
                <IdNummerForBarn
                    lesevisning={lesevisning}
                    skjema={skjema}
                    settIdNummerFelter={settIdNummerFelter}
                    landAlphaCode={barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand].svar}
                    barn={barn}
                />
            )}
        </KomponentGruppe>
    );
};

export default SamletIdNummerForBarn;
