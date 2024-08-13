import React from 'react';

import { useIntl } from 'react-intl';

import { FormSummary } from '@navikt/ds-react';
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

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const SamboerOppsummering: React.FC<{ samboer: ISamboer | ITidligereSamboer }> = ({ samboer }) => {
    const { formatMessage } = useIntl();

    return (
        <FormSummary.Answer>
            <FormSummary.Value>
                <FormSummary.Answers>
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
                </FormSummary.Answers>
            </FormSummary.Value>
        </FormSummary.Answer>
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
                    {søknad.søker.sivilstand.type === ESivilstand.GIFT && (
                        <>
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
                        </>
                    )}

                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    dinLivssituasjonSpørsmålSpråkId[
                                        søknad.søker.utvidet.spørsmål.harSamboerNå.id
                                    ]
                                }
                            />
                        }
                        søknadsvar={søknad.søker.utvidet.spørsmål.harSamboerNå.svar}
                    />
                    {søknad.søker.utvidet.nåværendeSamboer && (
                        <SamboerOppsummering samboer={søknad.søker.utvidet.nåværendeSamboer} />
                    )}

                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={
                                    dinLivssituasjonSpørsmålSpråkId[
                                        DinLivssituasjonSpørsmålId.hattAnnenSamboerForSøktPeriode
                                    ]
                                }
                            />
                        }
                        søknadsvar={
                            søknad.søker.utvidet.spørsmål.hattAnnenSamboerForSøktPeriode.svar
                        }
                    />
                    {tidligereSamboere.map(tidligereSamboer => (
                        <SamboerOppsummering samboer={tidligereSamboer} />
                    ))}
                </>
            )}
            <OppsummeringFelt
                tittel={
                    <SpråkTekst
                        id={dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.erAsylsøker]}
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
        </Oppsummeringsbolk>
    );
};

export default DinLivssituasjonOppsummering;
