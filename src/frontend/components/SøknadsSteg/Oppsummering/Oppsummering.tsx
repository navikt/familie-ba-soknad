import React, { useState } from 'react';

import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';

import { Normaltekst } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { RouteEnum, useRoutes } from '../../../context/RoutesContext';
import { AlternativtSvarForInput, barnDataKeySpørsmål } from '../../../typer/person';
import { formaterDato } from '../../../utils/dato';
import { hentBostedSpråkId } from '../../../utils/person';
import { barnetsNavnValue, landkodeTilSpråk } from '../../../utils/visning';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { useOmBarnaDine } from '../OmBarnaDine/useOmBarnaDine';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../OmBarnet/spørsmål';
import { useOmBarnet } from '../OmBarnet/useOmBarnet';
import { useVelgBarn } from '../VelgBarn/useVelgBarn';
import AndreForelderOppsummering from './AndreForelderOppsummering';
import OmDegOppsummering from './OmDegOppsummering';
import { OppsummeringFelt } from './OppsummeringFelt';
import Oppsummeringsbolk from './Oppsummeringsbolk';
import { formaterDatoMedUkjent } from './utils';

const StyledNormaltekst = styled(Normaltekst)`
    padding-bottom: 4rem;
`;

export const StyledOppsummeringsFeltGruppe = styled.div`
    padding: 1rem 0 1rem 0;
`;

const Oppsummering: React.FC = () => {
    const intl = useIntl();
    const { formatMessage } = intl;
    const { søknad } = useApp();
    const { hentStegNummer, hentStegObjektForRoute, hentStegObjektForBarn } = useRoutes();
    const { push: pushHistory } = useHistory();
    const [valgtLocale] = useSprakContext();
    const [feilAnchors, settFeilAnchors] = useState<string[]>([]);

    const genererListeMedBarn = (søknadDatafelt: barnDataKeySpørsmål) =>
        søknad.barnInkludertISøknaden
            .filter(barn => barn[søknadDatafelt].svar === 'JA')
            .map(filtrertBarn => barnetsNavnValue(filtrertBarn, intl))
            .join(', ');

    const scrollTilFeil = (elementId: string) => {
        // Gjør dette for syns skyld, men push scroller ikke vinduet
        pushHistory({ hash: elementId });
        const element = document.getElementById(elementId);
        element && element.scrollIntoView();
    };

    const gåVidereCallback = (): Promise<boolean> => {
        feilAnchors[0] && scrollTilFeil(feilAnchors[0]);
        return Promise.resolve(feilAnchors.length === 0);
    };

    return (
        <Steg
            tittel={<SpråkTekst id={'oppsummering.sidetittel'} />}
            gåVidereCallback={gåVidereCallback}
        >
            <StyledNormaltekst>
                <SpråkTekst id={'oppsummering.info'} />
            </StyledNormaltekst>

            <OmDegOppsummering settFeilAnchors={settFeilAnchors} />

            <Oppsummeringsbolk
                route={hentStegObjektForRoute(RouteEnum.VelgBarn)}
                tittel={'hvilkebarn.sidetittel'}
                skjemaHook={useVelgBarn}
                settFeilAnchors={settFeilAnchors}
            >
                {søknad.barnInkludertISøknaden.map((barn, index) => (
                    <StyledOppsummeringsFeltGruppe key={index}>
                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'hvilkebarn.leggtilbarn.barnets-navn'} />}
                            søknadsvar={
                                barn.adressebeskyttelse
                                    ? intl.formatMessage({
                                          id: 'hvilkebarn.barn.bosted.adressesperre',
                                      })
                                    : barn.navn
                            }
                        />

                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'hvilkebarn.barn.fødselsnummer'} />}
                            søknadsvar={barn.ident}
                        />

                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'hvilkebarn.barn.bosted'} />}
                            søknadsvar={intl.formatMessage({
                                id: hentBostedSpråkId(barn),
                            })}
                        />
                    </StyledOppsummeringsFeltGruppe>
                ))}
            </Oppsummeringsbolk>
            <Oppsummeringsbolk
                route={hentStegObjektForRoute(RouteEnum.OmBarna)}
                tittel={'ombarna.sidetittel'}
                skjemaHook={useOmBarnaDine}
                settFeilAnchors={settFeilAnchors}
            >
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

            {søknad.barnInkludertISøknaden.map((barn, index) => {
                const enIndeksert = index + 1;
                const nummer = (hentStegNummer(RouteEnum.OmBarna) + enIndeksert).toString();
                return (
                    <Oppsummeringsbolk
                        tittel={'oppsummering.deltittel.ombarnet'}
                        språkValues={{ nummer, navn: barnetsNavnValue(barn, intl) }}
                        key={index}
                        route={hentStegObjektForBarn(barn)}
                        skjemaHook={useOmBarnet}
                        barnId={barn.id}
                        settFeilAnchors={settFeilAnchors}
                    >
                        {barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA && (
                            <OppsummeringFelt
                                tittel={
                                    <SpråkTekst
                                        id={'ombarnet.fosterbarn'}
                                        values={{ navn: barnetsNavnValue(barn, intl) }}
                                    />
                                }
                            />
                        )}
                        {barn[barnDataKeySpørsmål.oppholderSegIInstitusjon].svar === ESvar.JA && (
                            <StyledOppsummeringsFeltGruppe>
                                <OppsummeringFelt
                                    tittel={
                                        <SpråkTekst
                                            id={'ombarnet.institusjon'}
                                            values={{ navn: barnetsNavnValue(barn, intl) }}
                                        />
                                    }
                                />

                                <OppsummeringFelt
                                    tittel={<SpråkTekst id={'ombarnet.institusjon.navn.spm'} />}
                                    søknadsvar={barn[barnDataKeySpørsmål.institusjonsnavn].svar}
                                />

                                <OppsummeringFelt
                                    tittel={<SpråkTekst id={'ombarnet.institusjon.adresse.spm'} />}
                                    søknadsvar={barn[barnDataKeySpørsmål.institusjonsadresse].svar}
                                />

                                <OppsummeringFelt
                                    tittel={
                                        <SpråkTekst id={'ombarnet.institusjon.postnummer.spm'} />
                                    }
                                    søknadsvar={
                                        barn[barnDataKeySpørsmål.institusjonspostnummer].svar
                                    }
                                />

                                <OppsummeringFelt
                                    tittel={
                                        <SpråkTekst id={'ombarnet.institusjon.startdato.spm'} />
                                    }
                                    søknadsvar={formaterDato(
                                        barn[barnDataKeySpørsmål.institusjonOppholdStartdato].svar
                                    )}
                                />

                                <OppsummeringFelt
                                    tittel={
                                        <SpråkTekst id={'ombarnet.institusjon.sluttdato.spm'} />
                                    }
                                    søknadsvar={formaterDatoMedUkjent(
                                        barn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar,
                                        formatMessage({
                                            id:
                                                omBarnetSpørsmålSpråkId[
                                                    OmBarnetSpørsmålsId.institusjonOppholdVetIkke
                                                ],
                                        })
                                    )}
                                />
                            </StyledOppsummeringsFeltGruppe>
                        )}
                        {barn[barnDataKeySpørsmål.oppholderSegIUtland].svar === ESvar.JA && (
                            <StyledOppsummeringsFeltGruppe>
                                <OppsummeringFelt
                                    tittel={
                                        <SpråkTekst
                                            id={'ombarnet.oppholdutland'}
                                            values={{ navn: barnetsNavnValue(barn, intl) }}
                                        />
                                    }
                                />
                                <OppsummeringFelt
                                    tittel={
                                        <SpråkTekst
                                            id={'ombarnet.oppholdutland.land.spm'}
                                            values={{ navn: barnetsNavnValue(barn, intl) }}
                                        />
                                    }
                                    søknadsvar={landkodeTilSpråk(
                                        barn[barnDataKeySpørsmål.oppholdsland].svar,
                                        valgtLocale
                                    )}
                                />

                                <OppsummeringFelt
                                    tittel={
                                        <SpråkTekst id={'ombarnet.oppholdutland.startdato.spm'} />
                                    }
                                    søknadsvar={formaterDato(
                                        barn[barnDataKeySpørsmål.oppholdslandStartdato].svar
                                    )}
                                />

                                <OppsummeringFelt
                                    tittel={
                                        <SpråkTekst id={'ombarnet.oppholdutland.sluttdato.spm'} />
                                    }
                                    søknadsvar={formaterDatoMedUkjent(
                                        barn[barnDataKeySpørsmål.oppholdslandSluttdato].svar,
                                        formatMessage({
                                            id:
                                                omBarnetSpørsmålSpråkId[
                                                    OmBarnetSpørsmålsId.oppholdslandSluttDatoVetIkke
                                                ],
                                        })
                                    )}
                                />
                            </StyledOppsummeringsFeltGruppe>
                        )}
                        {barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge].svar === ESvar.JA && (
                            <StyledOppsummeringsFeltGruppe>
                                <OppsummeringFelt
                                    tittel={
                                        <SpråkTekst
                                            id={'ombarnet.sammenhengende-opphold'}
                                            values={{ navn: barnetsNavnValue(barn, intl) }}
                                        />
                                    }
                                />
                                <OppsummeringFelt
                                    tittel={
                                        <SpråkTekst
                                            id={'ombarnet.sammenhengende-opphold.dato.spm'}
                                        />
                                    }
                                    søknadsvar={formaterDatoMedUkjent(
                                        barn[barnDataKeySpørsmål.nårKomBarnTilNorgeDato].svar,
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.nårKomBarnetTilNorgeIkkeAnkommet
                                        ]
                                    )}
                                />
                                <OppsummeringFelt
                                    tittel={
                                        <SpråkTekst
                                            id={'ombarnet.planlagt-sammenhengende-opphold.spm'}
                                        />
                                    }
                                    søknadsvar={
                                        barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].svar
                                    }
                                />
                            </StyledOppsummeringsFeltGruppe>
                        )}
                        {barn[barnDataKeySpørsmål.barnetrygdFraAnnetEøsland].svar === ESvar.JA && (
                            <StyledOppsummeringsFeltGruppe>
                                <OppsummeringFelt
                                    tittel={
                                        <SpråkTekst
                                            id={'ombarnet.barnetrygd-eøs'}
                                            values={{ navn: barnetsNavnValue(barn, intl) }}
                                        />
                                    }
                                />
                                <OppsummeringFelt
                                    tittel={<SpråkTekst id={'ombarnet.barnetrygd-eøs.land.spm'} />}
                                    søknadsvar={landkodeTilSpråk(
                                        barn[barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand]
                                            .svar,
                                        valgtLocale
                                    )}
                                />
                            </StyledOppsummeringsFeltGruppe>
                        )}
                        {barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI && (
                            <AndreForelderOppsummering barn={barn} />
                        )}
                        <StyledOppsummeringsFeltGruppe>
                            <OppsummeringFelt tittel={<SpråkTekst id={'ombarnet.bosted'} />} />

                            <OppsummeringFelt
                                tittel={
                                    <SpråkTekst
                                        id={'ombarnet.bor-fast.spm'}
                                        values={{ navn: barnetsNavnValue(barn, intl) }}
                                    />
                                }
                                søknadsvar={barn[barnDataKeySpørsmål.borFastMedSøker].svar}
                            />
                            {barn[barnDataKeySpørsmål.erFosterbarn].svar !== ESvar.JA && (
                                <OppsummeringFelt
                                    tittel={
                                        <SpråkTekst
                                            id={'ombarnet.delt-bosted.spm'}
                                            values={{ navn: barnetsNavnValue(barn, intl) }}
                                        />
                                    }
                                    søknadsvar={
                                        barn[barnDataKeySpørsmål.skriftligAvtaleOmDeltBosted].svar
                                    }
                                />
                            )}
                        </StyledOppsummeringsFeltGruppe>
                        <StyledOppsummeringsFeltGruppe>
                            <OppsummeringFelt
                                tittel={
                                    <SpråkTekst
                                        id={'ombarnet.søker-for-periode.spm'}
                                        values={{ navn: barnetsNavnValue(barn, intl) }}
                                    />
                                }
                            />

                            {barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar !==
                            AlternativtSvarForInput.UKJENT ? (
                                <>
                                    <OppsummeringFelt
                                        tittel={
                                            <SpråkTekst
                                                id={'ombarnet.søker-for-periode.startdato.spm'}
                                            />
                                        }
                                        søknadsvar={formaterDato(
                                            barn[barnDataKeySpørsmål.søkerForTidsromStartdato].svar
                                        )}
                                    />
                                    <OppsummeringFelt
                                        tittel={
                                            <SpråkTekst
                                                id={'ombarnet.søker-for-periode.sluttdato.spm'}
                                            />
                                        }
                                        søknadsvar={formaterDato(
                                            barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar
                                        )}
                                    />
                                </>
                            ) : (
                                <OppsummeringFelt
                                    søknadsvar={formatMessage({
                                        id: 'ombarnet.søker-for-periode.vetikke.spm',
                                    })}
                                />
                            )}
                        </StyledOppsummeringsFeltGruppe>
                    </Oppsummeringsbolk>
                );
            })}
        </Steg>
    );
};

export default Oppsummering;
