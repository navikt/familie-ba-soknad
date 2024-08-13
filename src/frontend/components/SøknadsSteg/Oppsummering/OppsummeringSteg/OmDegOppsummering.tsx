import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../context/AppContext';
import { useRoutes } from '../../../../context/RoutesContext';
import { useSpråk } from '../../../../context/SpråkContext';
import { RouteEnum } from '../../../../typer/routes';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { genererAdresseVisning } from '../../../../utils/adresse';
import { landkodeTilSpråk } from '../../../../utils/språk';
import { jaNeiSvarTilSpråkId } from '../../../../utils/spørsmål';
import TekstBlock from '../../../Felleskomponenter/Sanity/TekstBlock';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtenlandsperiodeOppsummering } from '../../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';
import {
    omDegPersonopplysningerSpråkId,
    OmDegSpørsmålId,
    omDegSpørsmålSpråkId,
} from '../../OmDeg/spørsmål';
import { useOmdeg } from '../../OmDeg/useOmdeg';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';

const StyledUtenlandsperiodeOppsummering = styled(UtenlandsperiodeOppsummering)`
    border-bottom: none;
`;

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const OmDegOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { søknad, tekster, plainTekst } = useApp();
    const { valgtLocale } = useSpråk();
    const { formatMessage } = useIntl();
    const { hentRouteObjektForRouteEnum } = useRoutes();
    const omDegHook = useOmdeg();
    const forsidetekster = tekster()[ESanitySteg.FORSIDE];

    return (
        <Oppsummeringsbolk
            steg={hentRouteObjektForRouteEnum(RouteEnum.OmDeg)}
            tittel={'omdeg.sidetittel'}
            skjemaHook={omDegHook}
            settFeilAnchors={settFeilAnchors}
        >
            <OppsummeringFelt
                tittel={
                    <TekstBlock
                        block={forsidetekster.bekreftelsesboksBroedtekst}
                        brukTypografiWrapper={false}
                    />
                }
                søknadsvar={
                    søknad.lestOgForståttBekreftelse
                        ? plainTekst(forsidetekster.bekreftelsesboksErklaering)
                        : formatMessage({ id: jaNeiSvarTilSpråkId(ESvar.NEI) })
                }
            />
            <OppsummeringFelt
                tittel={<SpråkTekst id={'felles.fødsels-eller-dnummer.label'} />}
                søknadsvar={søknad.søker.ident}
            />
            <OppsummeringFelt
                tittel={<SpråkTekst id={omDegPersonopplysningerSpråkId.søkerStatsborgerskap} />}
                søknadsvar={søknad.søker.statsborgerskap
                    .map((statsborgerskap: { landkode: Alpha3Code }) =>
                        landkodeTilSpråk(statsborgerskap.landkode, valgtLocale)
                    )
                    .join(', ')}
            />
            <OppsummeringFelt
                tittel={<SpråkTekst id={omDegPersonopplysningerSpråkId.søkerSivilstatus} />}
                søknadsvar={søknad.søker.sivilstand.type}
            />
            <OppsummeringFelt
                tittel={<SpråkTekst id={omDegPersonopplysningerSpråkId.søkerAdresse} />}
                children={genererAdresseVisning(søknad.søker)}
            />
            {søknad.søker.borPåRegistrertAdresse.svar && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={omDegSpørsmålSpråkId[OmDegSpørsmålId.borPåRegistrertAdresse]}
                        />
                    }
                    søknadsvar={søknad.søker.borPåRegistrertAdresse.svar}
                />
            )}
            <OppsummeringFelt
                tittel={
                    <SpråkTekst id={omDegSpørsmålSpråkId[OmDegSpørsmålId.værtINorgeITolvMåneder]} />
                }
                søknadsvar={søknad.søker.værtINorgeITolvMåneder.svar}
            />
            {søknad.søker.utenlandsperioder.map((periode, index) => (
                <StyledUtenlandsperiodeOppsummering
                    key={index}
                    periode={periode}
                    nummer={index + 1}
                />
            ))}
            {søknad.søker.planleggerÅBoINorgeTolvMnd.svar && (
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={omDegSpørsmålSpråkId[OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd]}
                        />
                    }
                    søknadsvar={søknad.søker.planleggerÅBoINorgeTolvMnd.svar}
                />
            )}
        </Oppsummeringsbolk>
    );
};

export default OmDegOppsummering;
