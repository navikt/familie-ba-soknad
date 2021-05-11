import React, { ReactNode } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål, ESivilstand } from '../../../typer/person';
import { landkodeTilSpråk } from '../../../utils/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import Oppsummeringsbolk from './Oppsummeringsbolk';
import { useSendInnSkjema } from './useSendInnSkjema';

interface IOppsummeringsFeltProps {
    tittel: ReactNode;
    søknadsvar?: string;
}

const StyledNormaltekst = styled(Normaltekst)`
    padding-bottom: 4rem;
`;

const StyledOppsummeringsFelt = styled.div`
    padding: 0.25rem 0 0.25rem 0;
`;

const StyledOppsummeringsFeltGruppe = styled.div`
    padding: 1rem 0 1rem 0;
`;

const OppsummeringFelt: React.FC<IOppsummeringsFeltProps> = ({ tittel, søknadsvar }) => {
    let språktekstid: boolean | string = false;
    if (søknadsvar && søknadsvar in ESvar) {
        språktekstid = 'felles.svaralternativ.' + søknadsvar.toLowerCase();
    } else if (søknadsvar && søknadsvar in ESivilstand) {
        språktekstid = 'felles.sivilstatus.kode.' + søknadsvar;
    }

    return (
        <StyledOppsummeringsFelt>
            <Element>{tittel}</Element>
            <Normaltekst>
                {språktekstid ? <SpråkTekst id={språktekstid} /> : søknadsvar}
            </Normaltekst>
        </StyledOppsummeringsFelt>
    );
};

const Oppsummering: React.FC = () => {
    const intl = useIntl();
    const { søknad } = useApp();
    console.log(søknad);
    const { sendInnSkjema } = useSendInnSkjema();
    const genererListeMedBarn = (søknadDatafelt: barnDataKeySpørsmål) =>
        søknad.barnInkludertISøknaden
            .filter(barn => barn[søknadDatafelt].svar === 'JA')
            .map(filtrertBarn => filtrertBarn.navn)
            .join(', ');

    return (
        <Steg tittel={<SpråkTekst id={'oppsummering.sidetittel'} />}>
            <StyledNormaltekst>
                <SpråkTekst id={'oppsummering.info'} />
            </StyledNormaltekst>
            <Oppsummeringsbolk tittel={'omdeg.sidetittel'}>
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.personopplysninger.statsborgerskap'} />}
                        søknadsvar={søknad.søker.statsborgerskap
                            .map((statsborgerskap: { landkode: Alpha3Code }) =>
                                landkodeTilSpråk(statsborgerskap.landkode, intl.defaultLocale)
                            )
                            .join(', ')}
                    />
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.personopplysninger.fødselsnummer'} />}
                        søknadsvar={søknad.søker.ident}
                    />
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.personopplysninger.sivilstatus'} />}
                        søknadsvar={søknad.søker.sivilstand.type}
                    />
                </StyledOppsummeringsFeltGruppe>

                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.telefon.spm'} />}
                        søknadsvar={søknad.søker.telefonnummer.svar}
                    />
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.opphold-i-norge.spm'} />}
                        søknadsvar={søknad.søker.oppholderSegINorge.svar}
                    />
                    {søknad.søker.oppholdsland.svar && (
                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'omdeg.opphold-i-norge.land.spm'} />}
                            søknadsvar={landkodeTilSpråk(
                                søknad.søker.oppholdsland.svar,
                                intl.defaultLocale
                            )}
                        />
                    )}
                    {søknad.søker.oppholdslandDato.svar && (
                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'omdeg.opphold-i-norge.dato.spm'} />}
                            søknadsvar={søknad.søker.oppholdslandDato.svar}
                        />
                    )}

                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.opphold-sammenhengende.spm'} />}
                        søknadsvar={søknad.søker.værtINorgeITolvMåneder.svar}
                    />
                    {søknad.søker.komTilNorgeDato.svar && (
                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'omdeg.opphold-sammenhengende.dato.spm'} />}
                            søknadsvar={søknad.søker.komTilNorgeDato.svar}
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
                            søknadsvar={landkodeTilSpråk(
                                søknad.søker.arbeidsland.svar,
                                intl.defaultLocale
                            )}
                        />
                    )}
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'omdeg.utenlandspensjon.spm'} />}
                        søknadsvar={søknad.søker.mottarUtenlandspensjon.svar}
                    />
                    {søknad.søker.pensjonsland.svar && (
                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'omdeg.utenlandspensjon.land.spm'} />}
                            søknadsvar={landkodeTilSpråk(
                                søknad.søker.pensjonsland.svar,
                                intl.defaultLocale
                            )}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
            </Oppsummeringsbolk>

            <Oppsummeringsbolk tittel={'hvilkebarn.sidetittel'}>
                {søknad.barnInkludertISøknaden.map(barn => (
                    <StyledOppsummeringsFeltGruppe>
                        {barn.navn && (
                            <OppsummeringFelt
                                tittel={<SpråkTekst id={'hvilkebarn.leggtilbarn.barnets-navn'} />}
                                søknadsvar={barn.navn}
                            />
                        )}

                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'hvilkebarn.barn.fødselsnummer'} />}
                            søknadsvar={barn.ident}
                        />

                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'hvilkebarn.barn.bosted'} />}
                            søknadsvar={intl.formatMessage({
                                id: barn.borMedSøker
                                    ? 'hvilkebarn.barn.bosted.din-adresse'
                                    : 'hvilkebarn.barn.bosted.ikke-din-adresse',
                            })}
                        />
                    </StyledOppsummeringsFeltGruppe>
                ))}
            </Oppsummeringsbolk>
            <Oppsummeringsbolk tittel={'ombarna.sidetittel'}>
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarna.fosterbarn.spm'} />}
                        søknadsvar={søknad.erNoenAvBarnaFosterbarn.svar}
                    />

                    {søknad.erNoenAvBarnaFosterbarn.svar === 'JA' && (
                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'ombarna.fosterbarn.hvem.spm'} />}
                            søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.erFosterbarn)}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarna.institusjon.spm'} />}
                        søknadsvar={søknad.oppholderBarnSegIInstitusjon.svar}
                    />

                    {søknad.oppholderBarnSegIInstitusjon.svar === 'JA' && (
                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'ombarna.institusjon.hvem.spm'} />}
                            søknadsvar={genererListeMedBarn(
                                barnDataKeySpørsmål.oppholderSegIInstitusjon
                            )}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarna.adoptert.spm'} />}
                        søknadsvar={søknad.erBarnAdoptertFraUtland.svar}
                    />
                    {søknad.erBarnAdoptertFraUtland.svar === 'JA' && (
                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'ombarna.adoptert.hvem.spm'} />}
                            søknadsvar={genererListeMedBarn(
                                barnDataKeySpørsmål.erAdoptertFraUtland
                            )}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarna.opphold-utland.spm'} />}
                        søknadsvar={søknad.oppholderBarnSegIUtland.svar}
                    />
                    {søknad.oppholderBarnSegIUtland.svar === 'JA' && (
                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'ombarna.opphold-utland.hvem.spm'} />}
                            søknadsvar={genererListeMedBarn(
                                barnDataKeySpørsmål.oppholderSegIUtland
                            )}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarna.asyl.spm'} />}
                        søknadsvar={søknad.søktAsylForBarn.svar}
                    />
                    {søknad.søktAsylForBarn.svar === 'JA' && (
                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'ombarna.asyl.hvem.spm'} />}
                            søknadsvar={genererListeMedBarn(barnDataKeySpørsmål.erAsylsøker)}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarna.sammenhengende-opphold.spm'} />}
                        søknadsvar={søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar}
                    />

                    {søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar === 'NEI' && (
                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'ombarna.sammenhengende-opphold.hvem.spm'} />}
                            søknadsvar={genererListeMedBarn(
                                barnDataKeySpørsmål.boddMindreEnn12MndINorge
                            )}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
                <StyledOppsummeringsFeltGruppe>
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarna.barnetrygd-eøs.spm'} />}
                        søknadsvar={søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar}
                    />

                    {søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar === 'JA' && (
                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'ombarna.barnetrygd-eøs.hvem.spm'} />}
                            søknadsvar={genererListeMedBarn(
                                barnDataKeySpørsmål.barnetrygdFraAnnetEøsland
                            )}
                        />
                    )}
                </StyledOppsummeringsFeltGruppe>
            </Oppsummeringsbolk>
            <Knapp htmlType={'button'} onClick={sendInnSkjema}>
                Send inn søknad
            </Knapp>
        </Steg>
    );
};

export default Oppsummering;
