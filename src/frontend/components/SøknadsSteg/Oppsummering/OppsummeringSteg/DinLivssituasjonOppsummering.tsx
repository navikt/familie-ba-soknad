import React from 'react';

import { useIntl } from 'react-intl';

import { BodyShort } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../context/AppContext';
import { useRoutes } from '../../../../context/RoutesContext';
import { AlternativtSvarForInput } from '../../../../typer/common';
import { ESivilstand } from '../../../../typer/kontrakt/generelle';
import { ISamboer, ITidligereSamboer } from '../../../../typer/person';
import { PersonType } from '../../../../typer/personType';
import { RouteEnum } from '../../../../typer/routes';
import { formaterDato } from '../../../../utils/dato';
import { toÅrsakSpråkId } from '../../../../utils/språk';
import { jaNeiSvarTilSpråkId } from '../../../../utils/spørsmål';
import { ArbeidsperiodeOppsummering } from '../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '../../../Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import {
    DinLivssituasjonSpørsmålId,
    dinLivssituasjonSpørsmålSpråkId,
    samboerSpråkIder,
} from '../../DinLivssituasjon/spørsmål';
import { useDinLivssituasjon } from '../../DinLivssituasjon/useDinLivssituasjon';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../OppsummeringsFeltGruppe';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const SamboerOppsummering: React.FC<{ samboer: ISamboer | ITidligereSamboer }> = ({ samboer }) => {
    const { formatMessage } = useIntl();

    return (
        <>
            <OppsummeringFelt
                tittel={<SpråkTekst id={samboerSpråkIder.navn} />}
                søknadsvar={samboer.navn.svar}
            />
            <OppsummeringFelt
                tittel={<SpråkTekst id={samboerSpråkIder.fnr} />}
                søknadsvar={
                    samboer.ident.svar === AlternativtSvarForInput.UKJENT
                        ? formatMessage({
                              id: samboerSpråkIder.fnrUkjent,
                          })
                        : samboer.ident.svar
                }
            />
            {samboer.fødselsdato.svar && (
                <OppsummeringFelt
                    tittel={<SpråkTekst id={samboerSpråkIder.fødselsdato} />}
                    søknadsvar={
                        samboer.fødselsdato.svar === AlternativtSvarForInput.UKJENT
                            ? formatMessage({
                                  id: samboerSpråkIder.fødselsdatoUkjent,
                              })
                            : formaterDato(samboer.fødselsdato.svar)
                    }
                />
            )}
            <OppsummeringFelt
                tittel={<SpråkTekst id={samboerSpråkIder.samboerFraDato} />}
                søknadsvar={formaterDato(samboer.samboerFraDato.svar)}
            />
            {'samboerTilDato' in samboer && (
                <OppsummeringFelt
                    tittel={<SpråkTekst id={samboerSpråkIder.samboerTilDato} />}
                    søknadsvar={formaterDato(samboer.samboerTilDato.svar)}
                />
            )}
        </>
    );
};

const DinLivssituasjonOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { søknad, erUtvidet } = useApp();
    const { formatMessage } = useIntl();
    const { hentRouteObjektForRouteEnum } = useRoutes();
    const dinLivsituasjonHook = useDinLivssituasjon();

    const tidligereSamboere = søknad.søker.utvidet.tidligereSamboere;

    return (
        <Oppsummeringsbolk
            steg={hentRouteObjektForRouteEnum(RouteEnum.DinLivssituasjon)}
            tittel={'dinlivssituasjon.sidetittel'}
            skjemaHook={dinLivsituasjonHook}
            settFeilAnchors={settFeilAnchors}
        >
            {erUtvidet && (
                <>
                    <StyledOppsummeringsFeltGruppe>
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        dinLivssituasjonSpørsmålSpråkId[
                                            DinLivssituasjonSpørsmålId.årsak
                                        ]
                                    }
                                />
                            }
                            søknadsvar={formatMessage({
                                id:
                                    søknad.søker.utvidet.spørsmål.årsak.svar &&
                                    toÅrsakSpråkId(søknad.søker.utvidet.spørsmål.årsak.svar),
                            })}
                        />
                    </StyledOppsummeringsFeltGruppe>
                    {søknad.søker.sivilstand.type === ESivilstand.GIFT && (
                        <StyledOppsummeringsFeltGruppe>
                            <OppsummeringFelt
                                tittel={
                                    <SpråkTekst
                                        id={
                                            dinLivssituasjonSpørsmålSpråkId[
                                                DinLivssituasjonSpørsmålId.separertEnkeSkilt
                                            ]
                                        }
                                    />
                                }
                                søknadsvar={søknad.søker.utvidet.spørsmål.separertEnkeSkilt.svar}
                            />
                            {søknad.søker.utvidet.spørsmål.separertEnkeSkilt.svar === ESvar.JA && (
                                <>
                                    <OppsummeringFelt
                                        tittel={
                                            <SpråkTekst
                                                id={
                                                    dinLivssituasjonSpørsmålSpråkId[
                                                        DinLivssituasjonSpørsmålId
                                                            .separertEnkeSkiltUtland
                                                    ]
                                                }
                                            />
                                        }
                                        søknadsvar={
                                            søknad.søker.utvidet.spørsmål.separertEnkeSkiltUtland
                                                .svar
                                        }
                                    />
                                    <OppsummeringFelt
                                        tittel={
                                            <SpråkTekst
                                                id={
                                                    dinLivssituasjonSpørsmålSpråkId[
                                                        DinLivssituasjonSpørsmålId
                                                            .separertEnkeSkiltDato
                                                    ]
                                                }
                                            />
                                        }
                                        søknadsvar={formaterDato(
                                            søknad.søker.utvidet.spørsmål.separertEnkeSkiltDato.svar
                                        )}
                                    />
                                </>
                            )}
                        </StyledOppsummeringsFeltGruppe>
                    )}
                </>
            )}
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={dinLivssituasjonSpørsmålSpråkId[søknad.søker.harSamboerNå.id]}
                        />
                    }
                    søknadsvar={søknad.søker.harSamboerNå.svar}
                />
                {søknad.søker.nåværendeSamboer && (
                    <SamboerOppsummering samboer={søknad.søker.nåværendeSamboer} />
                )}
            </StyledOppsummeringsFeltGruppe>
            {erUtvidet && (
                <>
                    <StyledOppsummeringsFeltGruppe>
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        dinLivssituasjonSpørsmålSpråkId[
                                            DinLivssituasjonSpørsmålId
                                                .hattAnnenSamboerForSøktPeriode
                                        ]
                                    }
                                />
                            }
                        />
                        {tidligereSamboere && tidligereSamboere.length > 0 ? (
                            tidligereSamboere.map((tidligereSamboer, index) => (
                                <StyledOppsummeringsFeltGruppe key={index}>
                                    <SamboerOppsummering samboer={tidligereSamboer} />
                                </StyledOppsummeringsFeltGruppe>
                            ))
                        ) : (
                            <BodyShort>
                                <SpråkTekst id={jaNeiSvarTilSpråkId(ESvar.NEI)} />
                            </BodyShort>
                        )}
                    </StyledOppsummeringsFeltGruppe>
                </>
            )}
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                dinLivssituasjonSpørsmålSpråkId[
                                    DinLivssituasjonSpørsmålId.erAsylsøker
                                ]
                            }
                        />
                    }
                    søknadsvar={søknad.søker.erAsylsøker.svar}
                />
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                dinLivssituasjonSpørsmålSpråkId[
                                    DinLivssituasjonSpørsmålId.arbeidIUtlandet
                                ]
                            }
                        />
                    }
                    søknadsvar={søknad.søker.arbeidIUtlandet.svar}
                />

                {søknad.søker.arbeidsperioderUtland.map((periode, index) => (
                    <ArbeidsperiodeOppsummering
                        key={`arbeidsperiode-${index}`}
                        nummer={index + 1}
                        arbeidsperiode={periode}
                        gjelderUtlandet={true}
                        personType={PersonType.Søker}
                    />
                ))}

                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                dinLivssituasjonSpørsmålSpråkId[
                                    DinLivssituasjonSpørsmålId.mottarUtenlandspensjon
                                ]
                            }
                        />
                    }
                    søknadsvar={søknad.søker.mottarUtenlandspensjon.svar}
                />

                {søknad.søker.pensjonsperioderUtland.map((periode, index) => (
                    <PensjonsperiodeOppsummering
                        key={`utenlandsperiode-${index}`}
                        nummer={index + 1}
                        pensjonsperiode={periode}
                        gjelderUtlandet={true}
                        personType={PersonType.Søker}
                    />
                ))}
            </StyledOppsummeringsFeltGruppe>
        </Oppsummeringsbolk>
    );
};

export default DinLivssituasjonOppsummering;
