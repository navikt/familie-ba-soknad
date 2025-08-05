import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../../context/AppContext';
import { useRoutesContext } from '../../../../context/RoutesContext';
import { useSpråkContext } from '../../../../context/SpråkContext';
import { PersonType } from '../../../../typer/personType';
import { RouteEnum } from '../../../../typer/routes';
import { ESanitySteg } from '../../../../typer/sanity/sanity';
import { genererAdresseVisning } from '../../../../utils/adresse';
import { landkodeTilSpråk } from '../../../../utils/språk';
import { jaNeiSvarTilSpråkId } from '../../../../utils/spørsmål';
import { formaterFnr } from '../../../../utils/visning';
import TekstBlock from '../../../Felleskomponenter/Sanity/TekstBlock';
import { UtenlandsperiodeOppsummering } from '../../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';
import { useOmdeg } from '../../OmDeg/useOmdeg';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const OmDegOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { søknad, tekster, plainTekst } = useAppContext();
    const { OM_DEG: omDegTekster } = tekster();
    const { valgtLocale } = useSpråkContext();
    const { formatMessage } = useIntl();
    const { hentRouteObjektForRouteEnum } = useRoutesContext();
    const omDegHook = useOmdeg();
    const forsidetekster = tekster()[ESanitySteg.FORSIDE];

    return (
        <Oppsummeringsbolk
            steg={hentRouteObjektForRouteEnum(RouteEnum.OmDeg)}
            tittel={'omdeg.sidetittel'}
            tittelForSanity={omDegTekster.omDegTittel}
            skjemaHook={omDegHook}
            settFeilAnchors={settFeilAnchors}
        >
            <OppsummeringFelt
                tittel={<TekstBlock block={forsidetekster.bekreftelsesboksBroedtekst} />}
                søknadsvar={
                    søknad.lestOgForståttBekreftelse
                        ? plainTekst(forsidetekster.bekreftelsesboksErklaering)
                        : formatMessage({ id: jaNeiSvarTilSpråkId(ESvar.NEI) })
                }
            />
            <OppsummeringFelt
                tittel={plainTekst(omDegTekster.ident)}
                søknadsvar={formaterFnr(søknad.søker.ident)}
            />
            <OppsummeringFelt
                tittel={plainTekst(omDegTekster.statsborgerskap)}
                søknadsvar={søknad.søker.statsborgerskap
                    .map((statsborgerskap: { landkode: Alpha3Code }) =>
                        landkodeTilSpråk(statsborgerskap.landkode, valgtLocale)
                    )
                    .join(', ')}
            />
            <OppsummeringFelt
                tittel={plainTekst(omDegTekster.sivilstatus)}
                søknadsvar={søknad.søker.sivilstand.type}
            />
            <OppsummeringFelt
                tittel={plainTekst(omDegTekster.adresse)}
                children={genererAdresseVisning(søknad.søker, omDegTekster, plainTekst)}
            />
            {søknad.søker.borPåRegistrertAdresse.svar && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={omDegTekster.borPaaRegistrertAdresse.sporsmal} />}
                    søknadsvar={søknad.søker.borPåRegistrertAdresse.svar}
                />
            )}
            <OppsummeringFelt
                tittel={<TekstBlock block={omDegTekster.vaertINorgeITolvMaaneder.sporsmal} />}
                søknadsvar={søknad.søker.værtINorgeITolvMåneder.svar}
            />
            {søknad.søker.utenlandsperioder.map((periode, index) => (
                <UtenlandsperiodeOppsummering
                    key={index}
                    periode={periode}
                    nummer={index + 1}
                    personType={PersonType.Søker}
                />
            ))}
            {søknad.søker.planleggerÅBoINorgeTolvMnd.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock block={omDegTekster.planleggerAaBoINorgeTolvMnd.sporsmal} />
                    }
                    søknadsvar={søknad.søker.planleggerÅBoINorgeTolvMnd.svar}
                />
            )}
        </Oppsummeringsbolk>
    );
};

export default OmDegOppsummering;
