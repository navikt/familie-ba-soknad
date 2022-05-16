import React from 'react';

import { useIntl } from 'react-intl';

import { IOmsorgsperson } from '../../../../../typer/barn';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { PersonType } from '../../../../../utils/perioder';
import { toSlektsforholdSpråkId } from '../../../../../utils/språk';
import { ArbeidsperiodeOppsummering } from '../../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
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
        </StyledOppsummeringsFeltGruppe>
    );
};

export default EøsOmsorgspersonOppsummering;
