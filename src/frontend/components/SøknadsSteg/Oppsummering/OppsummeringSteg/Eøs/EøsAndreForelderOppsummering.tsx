import React from 'react';

import { useIntl } from 'react-intl';

import {
    andreForelderDataKeySpørsmål,
    IAndreForelder,
    IBarnMedISøknad,
} from '../../../../../typer/barn';
import { barnetsNavnValue } from '../../../../../utils/barn';
import { ArbeidsperiodeOppsummering } from '../../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '../../../../Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtbetalingsperiodeOppsummering } from '../../../../Felleskomponenter/UtbetalingerModal/UtbetalingsperiodeOppsummering';
import { eøsBarnSpørsmålSpråkId } from '../../../EøsSteg/Barn/spørsmål';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';

const EøsAndreForelderOppsummering: React.FC<{
    barn: IBarnMedISøknad;
    andreForelder: IAndreForelder;
}> = ({ barn, andreForelder }) => {
    const intl = useIntl();
    const barnetsNavn = barnetsNavnValue(barn, intl);

    const jaNeiSpmOppsummering = (andreForelderDataKeySpm: andreForelderDataKeySpørsmål) =>
        barn.andreForelder ? (
            <OppsummeringFelt
                tittel={
                    <SpråkTekst
                        id={eøsBarnSpørsmålSpråkId[barn.andreForelder[andreForelderDataKeySpm].id]}
                        values={{ barn: barnetsNavn }}
                    />
                }
                søknadsvar={barn.andreForelder[andreForelderDataKeySpm].svar}
            />
        ) : null;

    return (
        <>
            <StyledOppsummeringsFeltGruppe>
                {jaNeiSpmOppsummering(andreForelderDataKeySpørsmål.arbeidNorge)}
                {andreForelder.arbeidsperioderNorge.map((arbeidsperiode, index) => (
                    <ArbeidsperiodeOppsummering
                        key={`arbeidsperiode-andre-forelder-norge-${index}`}
                        arbeidsperiode={arbeidsperiode}
                        nummer={index + 1}
                    />
                ))}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                {jaNeiSpmOppsummering(andreForelderDataKeySpørsmål.pensjonNorge)}
                {andreForelder.pensjonsperioderNorge.map((pensjonsperiode, index) => (
                    <PensjonsperiodeOppsummering
                        key={`pensjonsperiode-andre-forelder-norge-${index}`}
                        pensjonsperiode={pensjonsperiode}
                        nummer={index + 1}
                    />
                ))}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                {jaNeiSpmOppsummering(andreForelderDataKeySpørsmål.andreUtbetalinger)}
                {andreForelder.andreUtbetalingsperioder.map((utbetalingsperiode, index) => (
                    <UtbetalingsperiodeOppsummering
                        key={`utbetalingsperiode-andre-forelder-${index}`}
                        utbetalingsperiode={utbetalingsperiode}
                        nummer={index + 1}
                    />
                ))}
            </StyledOppsummeringsFeltGruppe>
        </>
    );
};

export default EøsAndreForelderOppsummering;
