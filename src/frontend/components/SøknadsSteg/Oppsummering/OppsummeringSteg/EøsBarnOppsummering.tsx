import React from 'react';

import { useIntl } from 'react-intl';

import { useSteg } from '../../../../context/StegContext';
import { andreForelderDataKeySpørsmål, IBarnMedISøknad } from '../../../../typer/barn';
import { barnetsNavnValue } from '../../../../utils/barn';
import { ArbeidsperiodeOppsummering } from '../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '../../../Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtbetalingsperiodeOppsummering } from '../../../Felleskomponenter/UtbetalingerModal/UtbetalingsperiodeOppsummering';
import { eøsBarnSpørsmålSpråkId } from '../../EøsSteg/Barn/spørsmål';
import { useEøsForBarn } from '../../EøsSteg/Barn/useEøsForBarn';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../OppsummeringsFeltGruppe';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
    barn: IBarnMedISøknad;
    nummer: string;
}

const EøsBarnOppsummering: React.FC<Props> = ({ settFeilAnchors, nummer, barn }) => {
    const { hentStegObjektForBarnEøs } = useSteg();

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
        <Oppsummeringsbolk
            tittel={'eøs-om-barn.oppsummering.tittel'}
            språkValues={{ nummer, barn: barnetsNavn }}
            steg={hentStegObjektForBarnEøs(barn)}
            skjemaHook={useEøsForBarn}
            barnId={barn.id}
            settFeilAnchors={settFeilAnchors}
        >
            {barn.andreForelder && (
                <>
                    <StyledOppsummeringsFeltGruppe>
                        {jaNeiSpmOppsummering(andreForelderDataKeySpørsmål.arbeidNorge)}
                        {barn.andreForelder.arbeidsperioderNorge.map((arbeidsperiode, index) => (
                            <ArbeidsperiodeOppsummering
                                key={`arbeidsperiode-andre-forelder-norge-${index}`}
                                arbeidsperiode={arbeidsperiode}
                                nummer={index + 1}
                            />
                        ))}
                    </StyledOppsummeringsFeltGruppe>
                    <StyledOppsummeringsFeltGruppe>
                        {jaNeiSpmOppsummering(andreForelderDataKeySpørsmål.pensjonNorge)}
                        {barn.andreForelder.pensjonsperioderNorge.map((pensjonsperiode, index) => (
                            <PensjonsperiodeOppsummering
                                key={`pensjonsperiode-andre-forelder-norge-${index}`}
                                pensjonsperiode={pensjonsperiode}
                                nummer={index + 1}
                            />
                        ))}
                    </StyledOppsummeringsFeltGruppe>
                    <StyledOppsummeringsFeltGruppe>
                        {jaNeiSpmOppsummering(andreForelderDataKeySpørsmål.andreUtbetalinger)}
                        {barn.andreForelder.andreUtbetalingsperioder.map(
                            (utbetalingsperiode, index) => (
                                <UtbetalingsperiodeOppsummering
                                    key={`utbetalingsperiode-andre-forelder-${index}`}
                                    utbetalingsperiode={utbetalingsperiode}
                                    nummer={index + 1}
                                />
                            )
                        )}
                    </StyledOppsummeringsFeltGruppe>
                </>
            )}
        </Oppsummeringsbolk>
    );
};

export default EøsBarnOppsummering;
