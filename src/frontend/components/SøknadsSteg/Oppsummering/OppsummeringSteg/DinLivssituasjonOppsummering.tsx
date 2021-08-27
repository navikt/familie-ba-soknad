import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../context/AppContext';
import { RouteEnum, useRoutes } from '../../../../context/RoutesContext';
import { ESivilstand } from '../../../../typer/person';
import { formaterDato } from '../../../../utils/dato';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import {
    DinLivssituasjonSpørsmålId,
    dinLivssituasjonSpørsmålSpråkId,
} from '../../Utvidet-DinLivssituasjon/spørsmål';
import { toÅrsakSpråkId } from '../../Utvidet-DinLivssituasjon/types-and-utilities';
import { useDinLivssituasjon } from '../../Utvidet-DinLivssituasjon/useDinLivssituasjon';
import { StyledOppsummeringsFeltGruppe } from '../Oppsummering';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const DinLivssituasjonOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { hentStegObjektForRoute } = useRoutes();
    const { søknad } = useApp();
    const { formatMessage } = useIntl();

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
        </Oppsummeringsbolk>
    );
};

export default DinLivssituasjonOppsummering;
