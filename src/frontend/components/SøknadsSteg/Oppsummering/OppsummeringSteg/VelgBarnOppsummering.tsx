import React from 'react';

import { FormSummary } from '@navikt/ds-react';

import { useAppContext } from '../../../../context/AppContext';
import { useRoutesContext } from '../../../../context/RoutesContext';
import { RouteEnum } from '../../../../typer/routes';
import { hentBostedSpråkId } from '../../../../utils/språk';
import { formaterFnr } from '../../../../utils/visning';
import TekstBlock from '../../../Felleskomponenter/Sanity/TekstBlock';
import { VelgBarnSpørsmålId, velgBarnSpørsmålSpråkId } from '../../VelgBarn/spørsmål';
import { useVelgBarn } from '../../VelgBarn/useVelgBarn';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const VelgBarnOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { søknad, tekster, plainTekst } = useAppContext();
    const { hentRouteObjektForRouteEnum } = useRoutesContext();
    const velgBarnHook = useVelgBarn();

    const velgBarnTekster = tekster().VELG_BARN;
    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;
    const leggTilBarnTekster = tekster().FELLES.modaler.leggTilBarn;

    return (
        <Oppsummeringsbolk
            steg={hentRouteObjektForRouteEnum(RouteEnum.VelgBarn)}
            tittel={velgBarnSpørsmålSpråkId[VelgBarnSpørsmålId.velgBarn]}
            tittelForSanity={velgBarnTekster.velgBarnTittel}
            skjemaHook={velgBarnHook}
            settFeilAnchors={settFeilAnchors}
        >
            {søknad.barnInkludertISøknaden.map((barn, index) => (
                <FormSummary.Answer key={index}>
                    <FormSummary.Label>
                        {plainTekst(frittståendeOrdTekster.barn)} {index + 1}
                    </FormSummary.Label>
                    <FormSummary.Value>
                        <FormSummary.Answers>
                            <OppsummeringFelt
                                tittel={
                                    <TekstBlock block={leggTilBarnTekster.barnetsNavnSubtittel} />
                                }
                                søknadsvar={
                                    barn.adressebeskyttelse
                                        ? plainTekst(velgBarnTekster.registrertMedAdressesperre)
                                        : barn.navn
                                }
                            />
                            <OppsummeringFelt
                                tittel={<TekstBlock block={velgBarnTekster.foedselsnummerLabel} />}
                                søknadsvar={formaterFnr(barn.ident)}
                            />
                            {!søknad.barnRegistrertManuelt.find(
                                barnRegistrertManuelt => barnRegistrertManuelt.ident === barn.ident
                            ) && (
                                <OppsummeringFelt
                                    tittel={
                                        <TekstBlock block={velgBarnTekster.registrertBostedLabel} />
                                    }
                                    søknadsvar={plainTekst(
                                        hentBostedSpråkId(barn, velgBarnTekster)
                                    )}
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
