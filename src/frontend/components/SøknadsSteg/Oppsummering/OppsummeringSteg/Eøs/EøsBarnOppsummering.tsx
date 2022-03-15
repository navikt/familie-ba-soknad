import React from 'react';

import { useIntl } from 'react-intl';

import { useSteg } from '../../../../../context/StegContext';
import { IBarnMedISøknad } from '../../../../../typer/barn';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { barnetsNavnValue } from '../../../../../utils/barn';
import { toSlektsforholdSpråkId } from '../../../../../utils/språk';
import KomponentGruppe from '../../../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from '../../../EøsSteg/Barn/spørsmål';
import { useEøsForBarn } from '../../../EøsSteg/Barn/useEøsForBarn';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import Oppsummeringsbolk from '../../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';
import EøsAndreForelderOppsummering from './EøsAndreForelderOppsummering';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
    barn: IBarnMedISøknad;
    nummer: string;
}

const EøsBarnOppsummering: React.FC<Props> = ({ settFeilAnchors, nummer, barn }) => {
    const { hentStegObjektForBarnEøs } = useSteg();
    const eøsForBarnHook = useEøsForBarn(barn.id);

    const { formatMessage } = useIntl();
    const intl = useIntl();
    const barnetsNavn = barnetsNavnValue(barn, intl);

    const tittelSpm = (spørsmålId: string) => (
        <SpråkTekst id={eøsBarnSpørsmålSpråkId[spørsmålId]} values={{ barn: barnetsNavn }} />
    );
    return (
        <Oppsummeringsbolk
            tittel={'eøs-om-barn.oppsummering.tittel'}
            språkValues={{ nummer, barn: barnetsNavn }}
            steg={hentStegObjektForBarnEøs(barn)}
            skjemaHook={eøsForBarnHook}
            settFeilAnchors={settFeilAnchors}
        >
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={tittelSpm(barn.søkersSlektsforhold.id)}
                    søknadsvar={formatMessage({
                        id:
                            barn.søkersSlektsforhold.svar &&
                            toSlektsforholdSpråkId(barn.søkersSlektsforhold.svar),
                    })}
                />
                {barn.søkersSlektsforholdSpesifisering.svar && (
                    <OppsummeringFelt
                        tittel={tittelSpm(barn.søkersSlektsforholdSpesifisering.id)}
                        søknadsvar={barn.søkersSlektsforholdSpesifisering.svar}
                    />
                )}

                {barn.borMedAndreForelder.svar && (
                    <OppsummeringFelt
                        tittel={tittelSpm(barn.borMedAndreForelder.id)}
                        søknadsvar={barn.borMedAndreForelder.svar}
                    />
                )}
                <KomponentGruppe>
                    {barn.omsorgspersonNavn.svar && (
                        <OppsummeringFelt
                            tittel={tittelSpm(barn.omsorgspersonNavn.id)}
                            søknadsvar={barn.omsorgspersonNavn.svar}
                        />
                    )}
                    {barn.omsorgspersonSlektsforhold.svar && (
                        <OppsummeringFelt
                            tittel={tittelSpm(barn.omsorgspersonSlektsforhold.id)}
                            søknadsvar={formatMessage({
                                id:
                                    barn.omsorgspersonSlektsforhold.svar &&
                                    toSlektsforholdSpråkId(barn.omsorgspersonSlektsforhold.svar),
                            })}
                        />
                    )}
                    {barn.omsorgpersonSlektsforholdSpesifisering.svar && (
                        <OppsummeringFelt
                            tittel={tittelSpm(barn.omsorgpersonSlektsforholdSpesifisering.id)}
                            søknadsvar={barn.omsorgpersonSlektsforholdSpesifisering.svar}
                        />
                    )}
                    {barn.omsorgspersonIdNummer.svar && (
                        <OppsummeringFelt
                            tittel={tittelSpm(barn.omsorgspersonIdNummer.id)}
                            søknadsvar={
                                barn.omsorgspersonIdNummer.svar === AlternativtSvarForInput.UKJENT
                                    ? formatMessage({
                                          id: eøsBarnSpørsmålSpråkId[
                                              EøsBarnSpørsmålId.omsorgspersonIdNummerVetIkke
                                          ],
                                      })
                                    : barn.omsorgspersonIdNummer.svar
                            }
                        />
                    )}
                    {barn.omsorgspersonAdresse.svar && (
                        <OppsummeringFelt
                            tittel={tittelSpm(barn.omsorgspersonAdresse.id)}
                            søknadsvar={barn.omsorgspersonAdresse.svar}
                        />
                    )}
                </KomponentGruppe>
                {barn.barnetsAdresse.svar && (
                    <OppsummeringFelt
                        tittel={tittelSpm(barn.barnetsAdresse.id)}
                        søknadsvar={barn.barnetsAdresse.svar}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            {barn.andreForelder && (
                <EøsAndreForelderOppsummering barn={barn} andreForelder={barn.andreForelder} />
            )}
        </Oppsummeringsbolk>
    );
};

export default EøsBarnOppsummering;
