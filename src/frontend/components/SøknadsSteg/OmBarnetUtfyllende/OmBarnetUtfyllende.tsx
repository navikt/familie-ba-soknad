import React from 'react';

import { Checkbox } from 'nav-frontend-skjema';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';
import { OmBarnetSpørsmålSpråkId } from './spørsmål';
import { useOmBarnetUtfyllende } from './useOmBarnetUtfyllende';

const OmBarnetUtfyllende: React.FC<{ barnetsIdent: string }> = ({ barnetsIdent }) => {
    const { søknad } = useApp();
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
    } = useOmBarnetUtfyllende(barnetsIdent);
    const barn = søknad.barnInkludertISøknaden.find(barn => barn.ident === barnetsIdent);

    return barn ? (
        <Steg
            tittel={<SpråkTekst id={'ombarnet.sidetittel'} values={{ navn: barn.navn }} />}
            validerFelterOgVisFeilmelding={validerFelterOgVisFeilmelding}
            valideringErOk={valideringErOk}
            skjema={skjema}
            settSøknadsdataCallback={oppdaterSøknad}
        >
            {barn.erFosterbarn.svar === ESvar.JA && (
                <KomponentGruppe>
                    <Informasjonsbolk
                        tittelId={'ombarnet.fosterbarn'}
                        språkValues={{ navn: barn.navn }}
                    >
                        <VedleggNotis språkTekstId={'ombarnet.fosterbarn.vedleggsinfo'} />
                    </Informasjonsbolk>
                </KomponentGruppe>
            )}

            {barn.oppholderSegIInstitusjon.svar === ESvar.JA && (
                <SkjemaFieldset tittelId={'ombarnet.institusjon'} språkValues={{ navn: barn.navn }}>
                    <SkjemaFeltInput
                        felt={skjema.felter.institusjonsnavn}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={OmBarnetSpørsmålSpråkId.institusjonsnavn}
                    />
                    <SkjemaFeltInput
                        felt={skjema.felter.institusjonsadresse}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={OmBarnetSpørsmålSpråkId.institusjonsadresse}
                    />
                    <SkjemaFeltInput
                        felt={skjema.felter.institusjonspostnummer}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={OmBarnetSpørsmålSpråkId.institusjonspostnummer}
                        bredde={'S'}
                    />
                    <Datovelger
                        felt={skjema.felter.institusjonOppholdStart}
                        skjema={skjema}
                        labelTekstId={OmBarnetSpørsmålSpråkId['institusjon-opphold-startdato']}
                    />
                    <Datovelger
                        felt={skjema.felter.institusjonOppholdSlutt}
                        skjema={skjema}
                        labelTekstId={OmBarnetSpørsmålSpråkId['institusjon-opphold-sluttdato']}
                        disabled={skjema.felter.institusjonOppholdSluttVetIkke.verdi === ESvar.JA}
                    />
                    <Checkbox
                        label={
                            <SpråkTekst
                                id={OmBarnetSpørsmålSpråkId['institusjon-opphold-ukjent-sluttdato']}
                            />
                        }
                        {...skjema.felter.institusjonOppholdSluttVetIkke.hentNavInputProps(false)}
                        onChange={event => {
                            skjema.felter.institusjonOppholdSluttVetIkke
                                .hentNavInputProps(false)
                                .onChange(event.target.checked ? ESvar.JA : ESvar.NEI);
                        }}
                    />
                </SkjemaFieldset>
            )}
        </Steg>
    ) : null;
};

export default OmBarnetUtfyllende;
