import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useRoutes } from '../../../../context/RoutesContext';
import {
    AlternativtSvarForInput,
    barnDataKeySpørsmål,
    IBarnMedISøknad,
} from '../../../../typer/person';
import { formaterDato } from '../../../../utils/dato';
import { barnetsNavnValue, landkodeTilSpråk } from '../../../../utils/visning';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../OmBarnet/spørsmål';
import { useOmBarnet } from '../../OmBarnet/useOmBarnet';
import AndreForelderOppsummering from '../AndreForelderOppsummering';
import { StyledOppsummeringsFeltGruppe } from '../Oppsummering';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';
import { formaterDatoMedUkjent } from '../utils';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
    nummer: string;
    barn: IBarnMedISøknad;
    index: number;
}

const OmBarnetOppsummering: React.FC<Props> = ({ settFeilAnchors, nummer, barn, index }) => {
    const intl = useIntl();
    const { formatMessage } = intl;
    const { hentStegObjektForBarn } = useRoutes();
    const [valgtLocale] = useSprakContext();

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
                        tittel={<SpråkTekst id={'ombarnet.institusjon.postnummer.spm'} />}
                        søknadsvar={barn[barnDataKeySpørsmål.institusjonspostnummer].svar}
                    />

                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarnet.institusjon.startdato.spm'} />}
                        søknadsvar={formaterDato(
                            barn[barnDataKeySpørsmål.institusjonOppholdStartdato].svar
                        )}
                    />

                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarnet.institusjon.sluttdato.spm'} />}
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
                        tittel={<SpråkTekst id={'ombarnet.oppholdutland.startdato.spm'} />}
                        søknadsvar={formaterDato(
                            barn[barnDataKeySpørsmål.oppholdslandStartdato].svar
                        )}
                    />

                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarnet.oppholdutland.sluttdato.spm'} />}
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
                        tittel={<SpråkTekst id={'ombarnet.sammenhengende-opphold.dato.spm'} />}
                        søknadsvar={formaterDatoMedUkjent(
                            barn[barnDataKeySpørsmål.nårKomBarnTilNorgeDato].svar,
                            omBarnetSpørsmålSpråkId[
                                OmBarnetSpørsmålsId.nårKomBarnetTilNorgeIkkeAnkommet
                            ]
                        )}
                    />
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarnet.planlagt-sammenhengende-opphold.spm'} />}
                        søknadsvar={barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].svar}
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
                            barn[barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand].svar,
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
                        søknadsvar={barn[barnDataKeySpørsmål.skriftligAvtaleOmDeltBosted].svar}
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
                            tittel={<SpråkTekst id={'ombarnet.søker-for-periode.startdato.spm'} />}
                            søknadsvar={formaterDato(
                                barn[barnDataKeySpørsmål.søkerForTidsromStartdato].svar
                            )}
                        />
                        <OppsummeringFelt
                            tittel={<SpråkTekst id={'ombarnet.søker-for-periode.sluttdato.spm'} />}
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
};

export default OmBarnetOppsummering;
