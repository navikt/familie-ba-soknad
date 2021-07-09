import React from 'react';

import { useIntl } from 'react-intl';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import {
    AlternativtSvarForInput,
    barnDataKeySpørsmål,
    IBarnMedISøknad,
} from '../../../typer/person';
import { landkodeTilSpråk } from '../../../utils/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../OmBarnet/spørsmål';
import { StyledOppsummeringsFeltGruppe } from './Oppsummering';
import { OppsummeringFelt } from './OppsummeringFelt';
import { formaterDatoMedUkjent } from './utils';

const AndreForelderOppsummering: React.FC<{ barn: IBarnMedISøknad }> = ({ barn }) => {
    const { formatMessage } = useIntl();
    const [valgtLocale] = useSprakContext();

    return (
        <>
            <StyledOppsummeringsFeltGruppe>
                {barn[barnDataKeySpørsmål.andreForelderNavn].svar && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'ombarnet.andre-forelder'} />}
                        søknadsvar={
                            barn[barnDataKeySpørsmål.andreForelderNavn].svar !==
                            AlternativtSvarForInput.UKJENT
                                ? barn[barnDataKeySpørsmål.andreForelderNavn].svar
                                : formatMessage({
                                      id: 'ombarnet.andre-forelder.navn-ukjent.spm',
                                  })
                        }
                    />
                )}
                {barn[barnDataKeySpørsmål.andreForelderFnr].svar && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'felles.fødsels-eller-dnummer.label'} />}
                        søknadsvar={
                            barn[barnDataKeySpørsmål.andreForelderFnr].svar !==
                            AlternativtSvarForInput.UKJENT
                                ? barn[barnDataKeySpørsmål.andreForelderFnr].svar
                                : formatMessage({
                                      id: 'ombarnet.andre-forelder.fnr-ukjent.spm',
                                  })
                        }
                    />
                )}
                {barn[barnDataKeySpørsmål.andreForelderFødselsdato].svar && (
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'felles.fødselsdato.label'} />}
                        søknadsvar={formaterDatoMedUkjent(
                            barn[barnDataKeySpørsmål.andreForelderFødselsdato].svar,
                            formatMessage({
                                id:
                                    omBarnetSpørsmålSpråkId[
                                        OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent
                                    ],
                            })
                        )}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={'ombarnet.andre-forelder.arbeid-utland.spm'}
                            values={{ navn: barn.navn }}
                        />
                    }
                    søknadsvar={barn[barnDataKeySpørsmål.andreForelderArbeidUtlandet].svar}
                />
                {barn[barnDataKeySpørsmål.andreForelderArbeidUtlandetHvilketLand].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst id={'ombarnet.andre-forelder.arbeid-utland.land.spm'} />
                        }
                        søknadsvar={landkodeTilSpråk(
                            barn[barnDataKeySpørsmål.andreForelderArbeidUtlandetHvilketLand].svar,
                            valgtLocale
                        )}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={'ombarnet.andre-forelder.utenlandspensjon.spm'}
                            values={{ navn: barn.navn }}
                        />
                    }
                    søknadsvar={barn[barnDataKeySpørsmål.andreForelderPensjonUtland].svar}
                />
                {barn[barnDataKeySpørsmål.andreForelderPensjonHvilketLand].svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={'ombarnet.andre-forelder.utenlandspensjon.land.spm'}
                                values={{ navn: barn.navn }}
                            />
                        }
                        søknadsvar={landkodeTilSpråk(
                            barn[barnDataKeySpørsmål.andreForelderPensjonHvilketLand].svar,
                            valgtLocale
                        )}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
        </>
    );
};

export default AndreForelderOppsummering;
