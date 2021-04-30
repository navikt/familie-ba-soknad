import React, { ReactNode } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import { landkodeTilSpråk } from '../../../utils/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import Oppsummeringsbolk from './Oppsummeringsbolk';

interface IOppsummeringsFeltProps {
    tittel: ReactNode;
    søknadsvar?: string;
}

const StyledNormaltekst = styled(Normaltekst)`
    padding-bottom: 4rem;
`;

const StyledOppsummeringsFelt = styled.div`
    padding: 1rem 0 1rem 0;
`;

const OppsummeringFelt: React.FC<IOppsummeringsFeltProps> = ({ tittel, søknadsvar }) => {
    return (
        <StyledOppsummeringsFelt>
            <Element>{tittel}</Element>
            <Normaltekst>
                <SpråkTekst id={søknadsvar} />
            </Normaltekst>
        </StyledOppsummeringsFelt>
    );
};

const Oppsummering: React.FC = () => {
    const intl = useIntl();

    const { søknad } = useApp();
    console.log(søknad);

    return (
        <Steg tittel={<SpråkTekst id={'oppsummering.sidetittel'} />}>
            <StyledNormaltekst>
                <SpråkTekst id={'oppsummering.info'} />
            </StyledNormaltekst>
            <Oppsummeringsbolk tittel={'omdeg.sidetittel'}>
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.personopplysninger.fødselsnummer'} />}
                    søknadsvar={søknad.søker.ident}
                />
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.personopplysninger.statsborgerskap'} />}
                    søknadsvar={søknad.søker.statsborgerskap
                        .map((statsborgerskap: { landkode: Alpha3Code }) =>
                            landkodeTilSpråk(statsborgerskap.landkode, intl.locale)
                        )
                        .join(', ')}
                />
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.personopplysninger.sivilstatus'} />}
                    søknadsvar={søknad.søker.sivilstand.type}
                />
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.telefon.spm'} />}
                    søknadsvar={søknad.søker.telefonnummer.svar}
                />
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.opphold-i-norge.spm'} />}
                    søknadsvar={søknad.søker.oppholderSegINorge.svar}
                />
                {søknad.søker.oppholdsland.svar !== undefined && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.opphold-i-norge.land.spm'} />}
                        søknadsvar={landkodeTilSpråk(søknad.søker.oppholdsland.svar, intl.locale)}
                    />
                )}
                {søknad.søker.oppholdslandDato.svar !== '' && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.opphold-i-norge.dato.spm'} />}
                        søknadsvar={søknad.søker.oppholdslandDato.svar}
                    />
                )}

                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.opphold-sammenhengende.spm'} />}
                    søknadsvar={søknad.søker.værtINorgeITolvMåneder.svar}
                />
                {søknad.søker.komTilNorgeDato.svar !== '' && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.opphold-sammenhengende.dato.spm'} />}
                        søknadsvar={søknad.søker.komTilNorgeDato.svar}
                    />
                )}
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.planlagt-opphold-sammenhengende.spm'} />}
                    søknadsvar={søknad.søker.planleggerÅBoINorgeTolvMnd.svar}
                />
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.asylsøker.spm'} />}
                    søknadsvar={søknad.søker.erAsylsøker.svar}
                />
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.arbeid-utland.spm'} />}
                    søknadsvar={søknad.søker.jobberPåBåt.svar}
                />
                {søknad.søker.arbeidsland.svar !== undefined && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.arbeid-utland.land.spm'} />}
                        søknadsvar={søknad.søker.arbeidsland.svar}
                    />
                )}
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.utenlandspensjon.spm'} />}
                    søknadsvar={søknad.søker.mottarUtenlandspensjon.svar}
                />
                {søknad.søker.arbeidsland.svar !== undefined && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.utenlandspensjon.land.spm'} />}
                        søknadsvar={søknad.søker.pensjonsland.svar}
                    />
                )}
            </Oppsummeringsbolk>
        </Steg>
    );
};

export default Oppsummering;
