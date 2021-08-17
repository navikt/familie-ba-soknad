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
import { barnetsNavnValue, landkodeTilSpråk } from '../../../utils/visning';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../OmBarnet/spørsmål';
import { useOmBarnet } from '../OmBarnet/useOmBarnet';
import AndreForelderOppsummering from './AndreForelderOppsummering';
import { OppsummeringFelt } from './OppsummeringFelt';
import Oppsummeringsbolk from './Oppsummeringsbolk';
import OmBarnaOppsummering from './OppsummeringSteg/OmBarnaOppsummering';
import OmDegOppsummering from './OppsummeringSteg/OmDegOppsummering';
import VelgBarnOppsummering from './OppsummeringSteg/VelgBarnOppsummering';
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
    const { hentStegNummer, hentStegObjektForBarn } = useRoutes();
    const { push: pushHistory } = useHistory();
    const [valgtLocale] = useSprakContext();
    const [feilAnchors, settFeilAnchors] = useState<string[]>([]);

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
            <VelgBarnOppsummering settFeilAnchors={settFeilAnchors} />
            <OmBarnaOppsummering settFeilAnchors={settFeilAnchors} />

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
