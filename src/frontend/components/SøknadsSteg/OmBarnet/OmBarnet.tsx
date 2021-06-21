import React from 'react';

import styled from 'styled-components/macro';

import { Checkbox } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';

import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';
import AndreForelder from './AndreForelder';
import Oppfølgningsspørsmål from './Oppfølgningsspørsmål';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';
import { useOmBarnet } from './useOmBarnet';

const EksternLenkeContainer = styled.div`
    margin-bottom: 4rem;
`;

const OmBarnet: React.FC<{ barnetsIdent: string }> = ({ barnetsIdent }) => {
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        barn,
        andreBarnSomErFyltUt,
    } = useOmBarnet(barnetsIdent);

    return barn ? (
        <Steg
            tittel={<SpråkTekst id={'ombarnet.sidetittel'} values={{ navn: barn.navn }} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
            barn={barn}
        >
            <Oppfølgningsspørsmål barn={barn} skjema={skjema} />
            <AndreForelder
                barn={barn}
                skjema={skjema}
                andreBarnSomErFyltUt={andreBarnSomErFyltUt}
            />

            {skjema.felter.borFastMedSøker.erSynlig &&
                skjema.felter.skriftligAvtaleOmDeltBosted.erSynlig && (
                    <SkjemaFieldset
                        tittelId={'hvilkebarn.barn.bosted'}
                        språkValues={{ navn: barn.navn }}
                        dynamisk
                    >
                        <div>
                            <Normaltekst>
                                <SpråkTekst id={'ombarnet.bosted-info'} />
                            </Normaltekst>
                        </div>
                        <EksternLenkeContainer>
                            <EksternLenke
                                lenkeSpråkId={'ombarnet.les-mer-om-bosted.lenke'}
                                lenkeTekstSpråkId={'ombarnet.les-mer-om-bosted.lenketekst'}
                                target="_blank"
                            />
                        </EksternLenkeContainer>
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.borFastMedSøker}
                            spørsmålTekstId={
                                omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.borFastMedSøker]
                            }
                            språkValues={{ navn: barn.navn }}
                        />
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.skriftligAvtaleOmDeltBosted}
                            spørsmålTekstId={
                                omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted
                                ]
                            }
                            språkValues={{ navn: barn.navn }}
                        />
                        {skjema.felter.skriftligAvtaleOmDeltBosted.verdi === ESvar.JA && (
                            <VedleggNotis
                                språkTekstId={'ombarnet.delt-bosted.vedleggsinfo'}
                                dynamisk
                            />
                        )}
                    </SkjemaFieldset>
                )}

            {skjema.felter.søkerForTidsromCheckbox.erSynlig &&
                skjema.felter.søkerForTidsromStartdato.erSynlig &&
                skjema.felter.søkerForTidsromSluttdato.erSynlig && (
                    <SkjemaFieldset
                        tittelId={'ombarnet.søker-for-periode.spm'}
                        språkValues={{ navn: barn.navn }}
                        dynamisk
                    >
                        <AlertStripe>
                            <SpråkTekst id={'ombarnet.søker-for-periode.alert'} />
                        </AlertStripe>
                        <Datovelger
                            felt={skjema.felter.søkerForTidsromStartdato}
                            skjema={skjema}
                            labelTekstId={
                                omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.søkerForTidsromStartdato
                                ]
                            }
                            disabled={skjema.felter.søkerForTidsromCheckbox.verdi === ESvar.JA}
                        />
                        <Datovelger
                            felt={skjema.felter.søkerForTidsromSluttdato}
                            fraOgMedFelt={skjema.felter.søkerForTidsromStartdato}
                            skjema={skjema}
                            labelTekstId={
                                omBarnetSpørsmålSpråkId[
                                    OmBarnetSpørsmålsId.søkerForTidsromSluttdato
                                ]
                            }
                            disabled={skjema.felter.søkerForTidsromCheckbox.verdi === ESvar.JA}
                        />
                        <Checkbox
                            label={
                                <SpråkTekst
                                    id={
                                        omBarnetSpørsmålSpråkId[
                                            OmBarnetSpørsmålsId.søkerIkkeForTidsrom
                                        ]
                                    }
                                />
                            }
                            defaultChecked={
                                skjema.felter.søkerForTidsromCheckbox.verdi === ESvar.JA
                            }
                            onChange={event => {
                                skjema.felter.søkerForTidsromCheckbox
                                    .hentNavInputProps(false)
                                    .onChange(event.target.checked ? ESvar.JA : ESvar.NEI);
                            }}
                        />
                    </SkjemaFieldset>
                )}
        </Steg>
    ) : null;
};

export default OmBarnet;
