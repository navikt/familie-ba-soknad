import React from 'react';

import { useIntl } from 'react-intl';

import { useSteg } from '../../../../../context/StegContext';
import { IBarnMedISøknad } from '../../../../../typer/barn';
import { AlternativtSvarForInput } from '../../../../../typer/common';
import { barnetsNavnValue } from '../../../../../utils/barn';
import { toSlektsforholdSpråkId } from '../../../../../utils/språk';
import KomponentGruppe from '../../../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import SamletIdNummerForBarn from '../../../EøsSteg/Barn/SamletIdNummerForBarn';
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
            <SamletIdNummerForBarn
                barn={barn}
                settIdNummerFelter={eøsForBarnHook.settIdNummerFelterForBarn}
                skjema={eøsForBarnHook.skjema}
                lesevisning={true}
            />
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
                {barn.omsorgsperson && (
                    <KomponentGruppe>
                        <OppsummeringFelt
                            tittel={tittelSpm(barn.omsorgsperson.omsorgspersonNavn.id)}
                            søknadsvar={barn.omsorgsperson.omsorgspersonNavn.svar}
                        />

                        <OppsummeringFelt
                            tittel={tittelSpm(barn.omsorgsperson.omsorgspersonSlektsforhold.id)}
                            søknadsvar={formatMessage({
                                id:
                                    barn.omsorgsperson.omsorgspersonSlektsforhold.svar &&
                                    toSlektsforholdSpråkId(
                                        barn.omsorgsperson.omsorgspersonSlektsforhold.svar
                                    ),
                            })}
                        />

                        {barn.omsorgsperson.omsorgpersonSlektsforholdSpesifisering.svar && (
                            <OppsummeringFelt
                                tittel={tittelSpm(
                                    barn.omsorgsperson.omsorgpersonSlektsforholdSpesifisering.id
                                )}
                                søknadsvar={
                                    barn.omsorgsperson.omsorgpersonSlektsforholdSpesifisering.svar
                                }
                            />
                        )}

                        <OppsummeringFelt
                            tittel={tittelSpm(barn.omsorgsperson.omsorgspersonIdNummer.id)}
                            søknadsvar={
                                barn.omsorgsperson.omsorgspersonIdNummer.svar ===
                                AlternativtSvarForInput.UKJENT
                                    ? formatMessage({
                                          id: eøsBarnSpørsmålSpråkId[
                                              EøsBarnSpørsmålId.omsorgspersonIdNummerVetIkke
                                          ],
                                      })
                                    : barn.omsorgsperson.omsorgspersonIdNummer.svar
                            }
                        />

                        <OppsummeringFelt
                            tittel={tittelSpm(barn.omsorgsperson.omsorgspersonAdresse.id)}
                            søknadsvar={barn.omsorgsperson.omsorgspersonAdresse.svar}
                        />
                    </KomponentGruppe>
                )}
                {barn.adresse.svar && (
                    <OppsummeringFelt
                        tittel={tittelSpm(barn.adresse.id)}
                        søknadsvar={
                            barn.adresse.svar === AlternativtSvarForInput.UKJENT
                                ? formatMessage({
                                      id: eøsBarnSpørsmålSpråkId[
                                          EøsBarnSpørsmålId.barnetsAdresseVetIkke
                                      ],
                                  })
                                : barn.adresse.svar
                        }
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            {barn.andreForelder && (
                <EøsAndreForelderOppsummering
                    barn={barn}
                    andreForelder={barn.andreForelder}
                    skjema={eøsForBarnHook.skjema}
                    settIdNummerFelter={eøsForBarnHook.settIdNummerFelterForAndreForelder}
                />
            )}
        </Oppsummeringsbolk>
    );
};

export default EøsBarnOppsummering;
