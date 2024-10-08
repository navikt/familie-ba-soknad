import React from 'react';

import { useIntl } from 'react-intl';

import { FormSummary } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { useRoutes } from '../../../../context/RoutesContext';
import { RouteEnum } from '../../../../typer/routes';
import { hentBostedSpråkId } from '../../../../utils/språk';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { VelgBarnSpørsmålId, velgBarnSpørsmålSpråkId } from '../../VelgBarn/spørsmål';
import { useVelgBarn } from '../../VelgBarn/useVelgBarn';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const VelgBarnOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { formatMessage } = useIntl();
    const { søknad } = useApp();
    const { hentRouteObjektForRouteEnum } = useRoutes();
    const velgBarnHook = useVelgBarn();

    return (
        <Oppsummeringsbolk
            steg={hentRouteObjektForRouteEnum(RouteEnum.VelgBarn)}
            tittel={velgBarnSpørsmålSpråkId[VelgBarnSpørsmålId.velgBarn]}
            skjemaHook={velgBarnHook}
            settFeilAnchors={settFeilAnchors}
        >
            {søknad.barnInkludertISøknaden.map((barn, index) => (
                <FormSummary.Answer key={index}>
                    <FormSummary.Label>
                        <SpråkTekst id="hvilkebarn.barn.anonym" /> {index + 1}
                    </FormSummary.Label>
                    <FormSummary.Value>
                        <FormSummary.Answers>
                            <OppsummeringFelt
                                tittel={
                                    <SpråkTekst
                                        id={velgBarnSpørsmålSpråkId[VelgBarnSpørsmålId.barnetsNavn]}
                                    />
                                }
                                søknadsvar={
                                    barn.adressebeskyttelse
                                        ? formatMessage({
                                              id: 'hvilkebarn.barn.bosted.adressesperre',
                                          })
                                        : barn.navn
                                }
                            />

                            <OppsummeringFelt
                                tittel={<SpråkTekst id={'hvilkebarn.barn.fødselsnummer'} />}
                                søknadsvar={barn.ident}
                            />

                            {!søknad.barnRegistrertManuelt.find(
                                barnRegistrertManuelt => barnRegistrertManuelt.ident === barn.ident
                            ) && (
                                <OppsummeringFelt
                                    tittel={<SpråkTekst id={'hvilkebarn.barn.bosted'} />}
                                    søknadsvar={formatMessage({
                                        id: hentBostedSpråkId(barn),
                                    })}
                                />
                            )}
                        </FormSummary.Answers>
                    </FormSummary.Value>
                </FormSummary.Answer>
            ))}
        </Oppsummeringsbolk>
    );
};

export default VelgBarnOppsummering;
