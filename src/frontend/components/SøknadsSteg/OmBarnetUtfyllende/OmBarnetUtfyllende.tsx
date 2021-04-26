import React from 'react';

import { Undertittel } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../typer/person';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';
import { OmBarnetUfyllendeSpørsmålSpråkId } from './spørsmål';
import { useOmBarnetUtfyllende } from './useOmBarnetUtfyllende';

const InternKomponent: React.FC<{ barn: IBarnMedISøknad }> = ({ barn }) => {
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
    } = useOmBarnetUtfyllende(barn);
    return (
        <Steg
            tittel={<SpråkTekst id={'ombarnet.sidetittel'} values={{ navn: barn.navn }} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            {barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA && (
                <KomponentGruppe>
                    <Undertittel>
                        <SpråkTekst
                            id={'ombarnet-utfyllende.fosterbarn.undertittel'}
                            values={{ navn: barn.navn }}
                        />
                    </Undertittel>
                    <VedleggNotis>
                        <SpråkTekst id={'ombarnet-utfyllende.vedleggsinfo.fosterbarn'} />
                    </VedleggNotis>
                </KomponentGruppe>
            )}
            <KomponentGruppe>
                {skjema.felter.institusjonsnavn.erSynlig && (
                    <Undertittel>
                        <SpråkTekst
                            id={'ombarnet-utfyllende.institusjon.undertittel'}
                            values={{ navn: barn.navn }}
                        />
                    </Undertittel>
                )}
                <SkjemaFeltInput
                    felt={skjema.felter.institusjonsnavn}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    labelSpråkTekstId={OmBarnetUfyllendeSpørsmålSpråkId.institusjonsnavn}
                />
                <SkjemaFeltInput
                    felt={skjema.felter.institusjonsadresse}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    labelSpråkTekstId={OmBarnetUfyllendeSpørsmålSpråkId.institusjonsadresse}
                />
                <SkjemaFeltInput
                    felt={skjema.felter.institusjonspostnummer}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    labelSpråkTekstId={OmBarnetUfyllendeSpørsmålSpråkId.institusjonspostnummer}
                    bredde={'S'}
                />
            </KomponentGruppe>
        </Steg>
    );
};

const OmBarnetUtfyllende: React.FC<{ barnetsIdent: string }> = ({ barnetsIdent }) => {
    const { søknad } = useApp();
    const barn = søknad.barnInkludertISøknaden.find(barn => barn.ident === barnetsIdent);
    return barn ? <InternKomponent barn={barn} /> : null;
};

export default OmBarnetUtfyllende;
