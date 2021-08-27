import React from 'react';

import { useIntl } from 'react-intl';

import { Normaltekst } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../context/AppContext';
import { RouteEnum, useRoutes } from '../../../../context/RoutesContext';
import {
    AlternativtSvarForInput,
    ESivilstand,
    ISamboer,
    ITidligereSamboer,
} from '../../../../typer/person';
import { formaterDato } from '../../../../utils/dato';
import { jaNeiSvarTilSpråkId } from '../../../../utils/spørsmål';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import {
    DinLivssituasjonSpørsmålId,
    dinLivssituasjonSpørsmålSpråkId,
    samboerSpråkIder,
} from '../../Utvidet-DinLivssituasjon/spørsmål';
import { toÅrsakSpråkId } from '../../Utvidet-DinLivssituasjon/types-and-utilities';
import { useDinLivssituasjon } from '../../Utvidet-DinLivssituasjon/useDinLivssituasjon';
import { StyledOppsummeringsFeltGruppe } from '../Oppsummering';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';

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
    const { hentStegObjektForRoute } = useRoutes();
    const { søknad } = useApp();
    const { formatMessage } = useIntl();

    const tidligereSamboere = søknad.søker.utvidet.tidligereSamboere;

    return (
        <Oppsummeringsbolk
            route={hentStegObjektForRoute(RouteEnum.DinLivssituasjon)}
            tittel={'dinlivssituasjon.sidetittel'}
            skjemaHook={useDinLivssituasjon}
            settFeilAnchors={settFeilAnchors}
        >
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.årsak]}
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
                                                DinLivssituasjonSpørsmålId.separertEnkeSkiltUtland
                                            ]
                                        }
                                    />
                                }
                                søknadsvar={
                                    søknad.søker.utvidet.spørsmål.separertEnkeSkiltUtland.svar
                                }
                            />
                            <OppsummeringFelt
                                tittel={
                                    <SpråkTekst
                                        id={
                                            dinLivssituasjonSpørsmålSpråkId[
                                                DinLivssituasjonSpørsmålId.separertEnkeSkiltDato
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
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={
                                dinLivssituasjonSpørsmålSpråkId[
                                    DinLivssituasjonSpørsmålId.harSamboerNå
                                ]
                            }
                        />
                    }
                    søknadsvar={søknad.søker.utvidet.spørsmål.harSamboerNå.svar}
                />
                {søknad.søker.utvidet.nåværendeSamboer && (
                    <SamboerOppsummering samboer={søknad.søker.utvidet.nåværendeSamboer} />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
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
                />
                {tidligereSamboere && tidligereSamboere.length > 0 ? (
                    tidligereSamboere.map(tidligereSamboer => (
                        <StyledOppsummeringsFeltGruppe>
                            <SamboerOppsummering samboer={tidligereSamboer} />
                        </StyledOppsummeringsFeltGruppe>
                    ))
                ) : (
                    <Normaltekst>
                        <SpråkTekst id={jaNeiSvarTilSpråkId(ESvar.NEI)} />
                    </Normaltekst>
                )}
            </StyledOppsummeringsFeltGruppe>
        </Oppsummeringsbolk>
    );
};

export default DinLivssituasjonOppsummering;
