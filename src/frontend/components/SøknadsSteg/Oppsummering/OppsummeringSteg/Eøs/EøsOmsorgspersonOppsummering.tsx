import React from 'react';

import { useIntl } from 'react-intl';

import { andreForelderDataKeySpørsmål } from '../../../../../typer/barn';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { IOmsorgsperson } from '../../../../../typer/omsorgsperson';
import { PersonType } from '../../../../../typer/personType';
import { toSlektsforholdSpråkId } from '../../../../../utils/språk';
import { ArbeidsperiodeOppsummering } from '../../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { BarnetrygdsperiodeOppsummering } from '../../../../Felleskomponenter/Barnetrygdperiode/BarnetrygdperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '../../../../Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtbetalingsperiodeOppsummering } from '../../../../Felleskomponenter/UtbetalingerModal/UtbetalingsperiodeOppsummering';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from '../../../EøsSteg/Barn/spørsmål';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';
import { tittelSpmEøsBarnOppsummering } from './utils';

const EøsOmsorgspersonOppsummering: React.FC<{
    omsorgsperson: IOmsorgsperson;
    barnetsNavn: string;
}> = ({ omsorgsperson, barnetsNavn }) => {
    const { formatMessage } = useIntl();

    return (
        <StyledOppsummeringsFeltGruppe>
            {omsorgsperson.navn.svar && (
                <OppsummeringFelt
                    tittel={tittelSpmEøsBarnOppsummering(omsorgsperson.navn.id, barnetsNavn)}
                    søknadsvar={omsorgsperson.navn.svar}
                />
            )}

            {omsorgsperson.slektsforhold.svar && (
                <OppsummeringFelt
                    tittel={tittelSpmEøsBarnOppsummering(
                        omsorgsperson.slektsforhold.id,
                        barnetsNavn
                    )}
                    søknadsvar={formatMessage({
                        id: toSlektsforholdSpråkId(omsorgsperson.slektsforhold.svar),
                    })}
                />
            )}

            {omsorgsperson.slektsforholdSpesifisering.svar && (
                <OppsummeringFelt
                    tittel={tittelSpmEøsBarnOppsummering(
                        omsorgsperson.slektsforholdSpesifisering.id,
                        barnetsNavn
                    )}
                    søknadsvar={omsorgsperson.slektsforholdSpesifisering.svar}
                />
            )}

            {omsorgsperson.idNummer.svar && (
                <OppsummeringFelt
                    tittel={tittelSpmEøsBarnOppsummering(omsorgsperson.idNummer.id, barnetsNavn)}
                    søknadsvar={
                        omsorgsperson.idNummer.svar === AlternativtSvarForInput.UKJENT
                            ? formatMessage({
                                  id: eøsBarnSpørsmålSpråkId[
                                      EøsBarnSpørsmålId.omsorgspersonIdNummerVetIkke
                                  ],
                              })
                            : omsorgsperson.idNummer.svar
                    }
                />
            )}

            {omsorgsperson.adresse.svar && (
                <OppsummeringFelt
                    tittel={tittelSpmEøsBarnOppsummering(omsorgsperson.adresse.id, barnetsNavn)}
                    søknadsvar={omsorgsperson.adresse.svar}
                />
            )}

            {omsorgsperson.arbeidUtland.svar && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={eøsBarnSpørsmålSpråkId[omsorgsperson.arbeidUtland.id]}
                            values={{ barn: barnetsNavn }}
                        />
                    }
                    søknadsvar={omsorgsperson.arbeidUtland.svar}
                />
            )}
            {omsorgsperson.arbeidsperioderUtland.map((arbeidsperiode, index) => (
                <ArbeidsperiodeOppsummering
                    key={`arbeidsperiode-omsorgsperson-utland-${index}`}
                    arbeidsperiode={arbeidsperiode}
                    nummer={index + 1}
                    personType={PersonType.Omsorgsperson}
                    gjelderUtlandet={true}
                />
            ))}
            {omsorgsperson.arbeidNorge.svar && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={eøsBarnSpørsmålSpråkId[omsorgsperson.arbeidNorge.id]}
                            values={{ barn: barnetsNavn }}
                        />
                    }
                    søknadsvar={omsorgsperson.arbeidNorge.svar}
                />
            )}
            {omsorgsperson.arbeidsperioderNorge.map((arbeidsperiode, index) => (
                <ArbeidsperiodeOppsummering
                    key={`arbeidsperiode-omsorgsperson-norge-${index}`}
                    arbeidsperiode={arbeidsperiode}
                    nummer={index + 1}
                    personType={PersonType.Omsorgsperson}
                    gjelderUtlandet={false}
                />
            ))}
            {omsorgsperson.pensjonUtland.svar && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={eøsBarnSpørsmålSpråkId[omsorgsperson.pensjonUtland.id]}
                            values={{ barn: barnetsNavn }}
                        />
                    }
                    søknadsvar={omsorgsperson.pensjonUtland.svar}
                />
            )}
            {omsorgsperson.pensjonsperioderUtland.map((pensjonsperiode, index) => (
                <PensjonsperiodeOppsummering
                    key={`pensjonsperiode-omsorgsperson-utland-${index}`}
                    pensjonsperiode={pensjonsperiode}
                    nummer={index + 1}
                    personType={PersonType.Omsorgsperson}
                    gjelderUtlandet={true}
                />
            ))}
            {omsorgsperson.pensjonNorge.svar && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={eøsBarnSpørsmålSpråkId[omsorgsperson.pensjonNorge.id]}
                            values={{ barn: barnetsNavn }}
                        />
                    }
                    søknadsvar={omsorgsperson.pensjonNorge.svar}
                />
            )}
            {omsorgsperson.pensjonsperioderNorge.map((pensjonsperiode, index) => (
                <PensjonsperiodeOppsummering
                    key={`pensjonsperiode-omsorgsperson-norge-${index}`}
                    pensjonsperiode={pensjonsperiode}
                    nummer={index + 1}
                    personType={PersonType.Omsorgsperson}
                    gjelderUtlandet={false}
                />
            ))}
            {omsorgsperson.andreUtbetalinger.svar && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={eøsBarnSpørsmålSpråkId[omsorgsperson.andreUtbetalinger.id]}
                            values={{ barn: barnetsNavn }}
                        />
                    }
                    søknadsvar={omsorgsperson.andreUtbetalinger.svar}
                />
            )}
            {omsorgsperson.andreUtbetalingsperioder.map((utbetalingsperiode, index) => (
                <UtbetalingsperiodeOppsummering
                    key={`utbetalingsperiode-omsorgsperson-${index}`}
                    utbetalingsperiode={utbetalingsperiode}
                    nummer={index + 1}
                    personType={PersonType.Omsorgsperson}
                    //TODO fikse at man sender inn barnet som trengs videre
                />
            ))}
            {omsorgsperson.barnetrygdFraEøs.svar && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={eøsBarnSpørsmålSpråkId[omsorgsperson.barnetrygdFraEøs.id]}
                            values={{ barn: barnetsNavn }}
                        />
                    }
                    søknadsvar={omsorgsperson.barnetrygdFraEøs.svar}
                />
            )}
            {omsorgsperson.eøsBarnetrygdsperioder.map((periode, index) => (
                <BarnetrygdsperiodeOppsummering
                    key={`barnetrygdperiode-omsorgsperson-${index}`}
                    nummer={index + 1}
                    barnetrygdsperiode={periode}
                    barnetsNavn={barnetsNavn}
                    personType={PersonType.Omsorgsperson}
                />
            ))}
        </StyledOppsummeringsFeltGruppe>
    );
};

export default EøsOmsorgspersonOppsummering;
