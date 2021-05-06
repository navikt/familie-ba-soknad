import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { barnDataKeySpørsmål } from '../../../typer/person';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaFieldset from '../../Felleskomponenter/SkjemaFieldset';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import Oppfølgningsspørsmål from './Oppfølgningsspørsmål';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from './spørsmål';
import { useOmBarnet } from './useOmBarnet';
import VetIkkeCheckbox from './VetIkkeCheckbox';

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
        >
            <Oppfølgningsspørsmål barn={barn} skjema={skjema} />

            <SkjemaFieldset tittelId={'ombarnet.andre-forelder'} språkValues={{ navn: barn.navn }}>
                <SkjemaFeltInput
                    felt={skjema.felter.andreForelderNavn}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    labelSpråkTekstId={
                        omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderNavn]
                    }
                    disabled={skjema.felter.andreForelderNavnUkjent.verdi === ESvar.JA}
                />
                <VetIkkeCheckbox
                    barn={barn}
                    labelSpråkId={
                        omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderNavnUkjent]
                    }
                    checkboxUkjentFelt={skjema.felter.andreForelderNavnUkjent}
                    søknadsdatafelt={barnDataKeySpørsmål.andreForelderNavn}
                />
                <SkjemaFeltInput
                    felt={skjema.felter.andreForelderFnr}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    labelSpråkTekstId={
                        omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderFnr]
                    }
                    disabled={skjema.felter.andreForelderFnrUkjent.verdi === ESvar.JA}
                />
                <VetIkkeCheckbox
                    barn={barn}
                    labelSpråkId={
                        omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderFnrUkjent]
                    }
                    checkboxUkjentFelt={skjema.felter.andreForelderFnrUkjent}
                    søknadsdatafelt={barnDataKeySpørsmål.andreForelderFnr}
                />
                <Datovelger
                    felt={skjema.felter.andreForelderFødselsdato}
                    skjema={skjema}
                    labelTekstId={
                        omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderFødselsdato]
                    }
                    disabled={skjema.felter.andreForelderFødselsdatoUkjent.verdi === ESvar.JA}
                />
                <VetIkkeCheckbox
                    barn={barn}
                    labelSpråkId={
                        omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent]
                    }
                    checkboxUkjentFelt={skjema.felter.andreForelderFødselsdatoUkjent}
                    søknadsdatafelt={barnDataKeySpørsmål.andreForelderFødselsdato}
                />
            </SkjemaFieldset>
        </Steg>
    ) : null;
};

export default OmBarnet;
