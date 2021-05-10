import React from 'react';

import styled from 'styled-components/macro';

import { Normaltekst } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';

import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import { SpråkLenke } from '../../Felleskomponenter/SpråkLenke/SpråkLenke';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';
import AndreForelder from './AndreForelder';
import Oppfølgningsspørsmål from './Oppfølgningsspørsmål';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';
import { useOmBarnet } from './useOmBarnet';

const StyledSpråkLenke = styled(SpråkLenke)`
    margin-top: 1.125rem;
`;

const OmBarnet: React.FC<{ barnetsIdent: string }> = ({ barnetsIdent }) => {
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        barn,
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
            <AndreForelder barn={barn} skjema={skjema} />

            {skjema.felter.borFastMedSøker.erSynlig &&
                skjema.felter.skriftligAvtaleOmDeltBosted.erSynlig && (
                    <SkjemaFieldset
                        tittelId={'hvilkebarn.barn.bosted'}
                        språkValues={{ navn: barn.navn }}
                    >
                        <div>
                            <Normaltekst>
                                <SpråkTekst id={'ombarnet.bosted-info'} />
                            </Normaltekst>
                        </div>
                        <StyledSpråkLenke
                            hrefId={'#'}
                            lenkeTekstId={'ombarnet.les-mer-om-bosted.lenketekst'}
                        />
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
                            <VedleggNotis språkTekstId={'ombarnet.delt-bosted.vedleggsinfo'} />
                        )}
                    </SkjemaFieldset>
                )}
        </Steg>
    ) : null;
};

export default OmBarnet;
