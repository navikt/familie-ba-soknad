import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../../context/AppContext';
import { RouteEnum, useRoutes } from '../../../../context/RoutesContext';
import { formaterDato } from '../../../../utils/dato';
import { genererAdresseVisning, landkodeTilSpråk } from '../../../../utils/visning';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { useOmdeg } from '../../OmDeg/useOmdeg';
import { StyledOppsummeringsFeltGruppe } from '../Oppsummering';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const OmDegOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { hentStegObjektForRoute } = useRoutes();
    const { søknad } = useApp();
    const [valgtLocale] = useSprakContext();

    return (
        <Oppsummeringsbolk
            route={hentStegObjektForRoute(RouteEnum.OmDeg)}
            tittel={'omdeg.sidetittel'}
            skjemaHook={useOmdeg}
            settFeilAnchors={settFeilAnchors}
        >
            <StyledOppsummeringsFeltGruppe>
                <Element>
                    <SpråkTekst id={'forside.bekreftelsesboks.brødtekst'} />
                </Element>
                <StyledOppsummeringsFeltGruppe>
                    <Normaltekst>
                        <SpråkTekst id={'forside.bekreftelsesboks.erklæring.spm'} />
                    </Normaltekst>
                </StyledOppsummeringsFeltGruppe>
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'felles.fødsels-eller-dnummer.label'} />}
                    søknadsvar={søknad.søker.ident}
                />
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.personopplysninger.statsborgerskap'} />}
                    søknadsvar={søknad.søker.statsborgerskap
                        .map((statsborgerskap: { landkode: Alpha3Code }) =>
                            landkodeTilSpråk(statsborgerskap.landkode, valgtLocale)
                        )
                        .join(', ')}
                />
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.personopplysninger.sivilstatus'} />}
                    søknadsvar={søknad.søker.sivilstand.type}
                />

                {søknad.søker.adresse && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.personopplysninger.adresse'} />}
                        children={genererAdresseVisning(søknad.søker.adresse)}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>

            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.opphold-i-norge.spm'} />}
                    søknadsvar={søknad.søker.oppholderSegINorge.svar}
                />
                {søknad.søker.oppholdsland.svar && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.opphold-i-norge.land.spm'} />}
                        søknadsvar={landkodeTilSpråk(søknad.søker.oppholdsland.svar, valgtLocale)}
                    />
                )}
                {søknad.søker.oppholdslandDato.svar && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.opphold-i-norge.dato.spm'} />}
                        søknadsvar={formaterDato(søknad.søker.oppholdslandDato.svar)}
                    />
                )}

                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.opphold-sammenhengende.spm'} />}
                    søknadsvar={søknad.søker.værtINorgeITolvMåneder.svar}
                />
                {søknad.søker.komTilNorgeDato.svar && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.opphold-sammenhengende.dato.spm'} />}
                        søknadsvar={formaterDato(søknad.søker.komTilNorgeDato.svar)}
                    />
                )}
                {søknad.søker.planleggerÅBoINorgeTolvMnd.svar && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.planlagt-opphold-sammenhengende.spm'} />}
                        søknadsvar={søknad.søker.planleggerÅBoINorgeTolvMnd.svar}
                    />
                )}
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.asylsøker.spm'} />}
                    søknadsvar={søknad.søker.erAsylsøker.svar}
                />
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.arbeid-utland.spm'} />}
                    søknadsvar={søknad.søker.jobberPåBåt.svar}
                />
                {søknad.søker.arbeidsland.svar && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.arbeid-utland.land.spm'} />}
                        søknadsvar={landkodeTilSpråk(søknad.søker.arbeidsland.svar, valgtLocale)}
                    />
                )}
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.utenlandspensjon.spm'} />}
                    søknadsvar={søknad.søker.mottarUtenlandspensjon.svar}
                />
                {søknad.søker.pensjonsland.svar && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.utenlandspensjon.land.spm'} />}
                        søknadsvar={landkodeTilSpråk(søknad.søker.pensjonsland.svar, valgtLocale)}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
        </Oppsummeringsbolk>
    );
};

export default OmDegOppsummering;
