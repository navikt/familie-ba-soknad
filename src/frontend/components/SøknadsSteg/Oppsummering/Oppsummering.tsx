import React, { ReactNode } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';

import { Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import { landkodeTilSpråk } from '../../../utils/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import Oppsummeringsbolk from './Oppsummeringsbolk';
import { useSendInnSkjema } from './useSendInnSkjema';

interface IOppsummeringsFeltProps {
    tittel: ReactNode;
    søknadsvar?: string;
}

const OppsummeringFelt: React.FC<IOppsummeringsFeltProps> = ({ tittel, søknadsvar }) => {
    return (
        <>
            <Element>{tittel}</Element>
            <Normaltekst>
                <SpråkTekst id={søknadsvar} />
            </Normaltekst>
        </>
    );
};

const Oppsummering: React.FC = () => {
    const intl = useIntl();

    const { søknad } = useApp();
    console.log(søknad);
    const { sendInnSkjema } = useSendInnSkjema();

    return (
        <Steg tittel={<SpråkTekst id={'ombarnadine.tittel'} />}>
            <Oppsummeringsbolk tittel={'oppsummering.omdeg-tittel'}>
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'felles.fødsels-eller-dnummer.label'} />}
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
                    <>
                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'omdeg.opphold-i-norge.land.spm'} />}
                            søknadsvar={landkodeTilSpråk(
                                søknad.søker.oppholdsland.svar,
                                intl.locale
                            )}
                        />
                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'omdeg.opphold-i-norge.dato.spm'} />}
                            søknadsvar={søknad.søker.oppholdslandDato.svar}
                        />
                    </>
                )}
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'omdeg.opphold-sammenhengende.spm'} />}
                    søknadsvar={søknad.søker.værtINorgeITolvMåneder.svar}
                />
            </Oppsummeringsbolk>
            <Knapp htmlType={'button'} onClick={sendInnSkjema}>
                Send inn søknad
            </Knapp>
        </Steg>
    );
};

export default Oppsummering;
