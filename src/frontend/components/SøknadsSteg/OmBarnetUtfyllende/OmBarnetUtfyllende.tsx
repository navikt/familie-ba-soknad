import React from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import slugify from 'slugify';

import { Undertittel } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../typer/person';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { VedleggNotis } from '../../Felleskomponenter/VedleggNotis';
import Steg from '../Steg/Steg';
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
            tittel={<SpråkTekst id={'ombarnet-utfyllende.tittel'} values={{ navn: barn.navn }} />}
            validerFelterOgVisFeilmelding={validerFelterOgVisFeilmelding}
            valideringErOk={valideringErOk}
            skjema={skjema}
            settSøknadsdataCallback={oppdaterSøknad}
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

const OmBarnetUtfyllende: React.FC = () => {
    const { søknad } = useApp();
    const { barnInkludertISøknaden } = søknad;
    const history = useHistory();
    const location = useLocation();
    const match = location.pathname.match(/\/barnet\/(.+)\/?/);

    if (!barnInkludertISøknaden.length) {
        history.push('/velg-barn');
        return null;
    }

    if (!match || match.length < 2) {
        history.push(`/barnet/${slugify('barn-1')}`);
        return null;
    }
    const navnParameter = match[1];

    const barn = barnInkludertISøknaden.find(
        (_barn, index) => slugify(`barn-${index + 1}`) === navnParameter
    );
    if (!barn) {
        history.push('/barnet');
        return null;
    }

    return <InternKomponent barn={barn} />;
};

export default OmBarnetUtfyllende;
