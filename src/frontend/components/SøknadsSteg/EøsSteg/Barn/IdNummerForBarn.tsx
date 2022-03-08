import React, { Dispatch, SetStateAction } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../../typer/barn';
import { IEøsForBarnFeltTyper } from '../../../../typer/skjema';
import { IdNummer } from '../IdNummer';
import { PeriodeType } from '../idnummerUtils';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from './spørsmål';

const IdNummerForBarn: React.FC<{
    landAlphaCode: Alpha3Code | '';
    periodeType?: PeriodeType;
    skjema: ISkjema<IEøsForBarnFeltTyper, string>;
    barn: IBarnMedISøknad;
    settIdNummerFelter: Dispatch<SetStateAction<Felt<string>[]>>;
}> = ({ landAlphaCode, skjema, barn, settIdNummerFelter, periodeType = undefined }) => {
    return (
        <IdNummer
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

export default IdNummerForBarn;
