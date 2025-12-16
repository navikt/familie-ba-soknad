import React from 'react';

import { ReadMore } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { ESanitySteg, Typografi } from '../../../../common/sanity';
import { Dokumentasjonsbehov } from '../../../../common/typer/kontrakt/dokumentasjon';
import { useAppContext } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { BarnetsId } from '../../../typer/common';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import Steg from '../../Felleskomponenter/Steg/Steg';

import AndreForelder from './AndreForelder';
import { OmBarnetHeader } from './OmBarnetHeader';
import Oppfølgningsspørsmål from './Oppfølgningsspørsmål';
import { barnErUnder16År, useOmBarnet } from './useOmBarnet';

const OmBarnet: React.FC<{ barnetsId: BarnetsId }> = ({ barnetsId }) => {
    const { tekster, plainTekst } = useAppContext();

    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        barn,
        andreBarnSomErFyltUt,
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
        utenlandsperioder,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        leggTilBarnetrygdsperiode,
        fjernBarnetrygdsperiode,
    } = useOmBarnet(barnetsId);

    const stegTekster = tekster()[ESanitySteg.OM_BARNET];
    const {
        omBarnetTittel,
        omBarnetGuide,
        borBarnFastSammenMedDeg,
        deltBosted,
        boddSammenMedAndreForelder,
        naarFlyttetFraAndreForelder,
        boFastSammenMedInformasjonTittel,
        boFastSammenMedInformasjon,
        skriftligAvtaleOmDeltBostedInformasjonTittel,
        skriftligAvtaleOmDeltBostedInformasjon,
    } = stegTekster;

    return barn ? (
        <Steg
            tittel={<TekstBlock block={omBarnetTittel} flettefelter={{ barnetsNavn: barn.navn }} />}
            guide={omBarnetGuide}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
            vedleggOppsummering={[
                {
                    skalVises: barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA,
                    dokumentasjonsbehov: Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN,
                },
                {
                    skalVises: skjema.felter.borFastMedSøker.verdi === ESvar.JA && !barn.borMedSøker,
                    dokumentasjonsbehov: Dokumentasjonsbehov.BOR_FAST_MED_SØKER,
                    flettefeltVerdier: { barnetsNavn: barn.navn },
                },
                {
                    skalVises: skjema.felter.skriftligAvtaleOmDeltBosted.verdi === ESvar.JA,
                    dokumentasjonsbehov: Dokumentasjonsbehov.AVTALE_DELT_BOSTED,
                },
                {
                    skalVises: skjema.felter.borMedAndreForelderCheckbox.erSynlig && barnErUnder16År(barn),
                    dokumentasjonsbehov: Dokumentasjonsbehov.MEKLINGSATTEST,
                },
            ]}
        >
            <OmBarnetHeader barn={barn} />
            <Oppfølgningsspørsmål
                barn={barn}
                skjema={skjema}
                leggTilUtenlandsperiode={leggTilUtenlandsperiode}
                fjernUtenlandsperiode={fjernUtenlandsperiode}
                utenlandsperioder={utenlandsperioder}
                leggTilBarnetrygdsperiode={leggTilBarnetrygdsperiode}
                fjernBarnetrygdsperiode={fjernBarnetrygdsperiode}
                registrerteEøsBarnetrygdsperioder={skjema.felter.registrerteEøsBarnetrygdsperioder}
            />
            {barn.andreForelder && (
                <AndreForelder
                    barn={barn}
                    skjema={skjema}
                    andreBarnSomErFyltUt={andreBarnSomErFyltUt}
                    leggTilArbeidsperiode={leggTilArbeidsperiode}
                    fjernArbeidsperiode={fjernArbeidsperiode}
                    leggTilPensjonsperiode={leggTilPensjonsperiode}
                    fjernPensjonsperiode={fjernPensjonsperiode}
                />
            )}
            {skjema.felter.borFastMedSøker.erSynlig && (
                <>
                    <div>
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.borFastMedSøker}
                            spørsmålDokument={borBarnFastSammenMedDeg}
                            flettefelter={{ barnetsNavn: barn.navn }}
                        />

                        <ReadMore header={plainTekst(boFastSammenMedInformasjonTittel)}>
                            <TekstBlock block={boFastSammenMedInformasjon} typografi={Typografi.BodyLong} />
                        </ReadMore>
                    </div>
                    {skjema.felter.skriftligAvtaleOmDeltBosted.erSynlig && (
                        <div>
                            <JaNeiSpm
                                skjema={skjema}
                                felt={skjema.felter.skriftligAvtaleOmDeltBosted}
                                spørsmålDokument={deltBosted}
                                flettefelter={{ barnetsNavn: barn.navn }}
                            />
                            <ReadMore header={plainTekst(skriftligAvtaleOmDeltBostedInformasjonTittel)}>
                                <TekstBlock
                                    block={skriftligAvtaleOmDeltBostedInformasjon}
                                    typografi={Typografi.BodyLong}
                                />
                            </ReadMore>
                        </div>
                    )}
                </>
            )}
            {skjema.felter.søkerHarBoddMedAndreForelder.erSynlig && (
                <>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.søkerHarBoddMedAndreForelder}
                        spørsmålDokument={boddSammenMedAndreForelder}
                        flettefelter={{ barnetsNavn: barn.navn }}
                        aria-live="polite"
                    />
                    {skjema.felter.søkerFlyttetFraAndreForelderDato.erSynlig && (
                        <div aria-live="polite">
                            <Datovelger
                                felt={skjema.felter.søkerFlyttetFraAndreForelderDato}
                                skjema={skjema}
                                label={<TekstBlock block={naarFlyttetFraAndreForelder.sporsmal} />}
                                disabled={skjema.felter.borMedAndreForelderCheckbox.verdi === ESvar.JA}
                                avgrensDatoFremITid={true}
                            />
                            {skjema.felter.borMedAndreForelderCheckbox.erSynlig && (
                                <SkjemaCheckbox
                                    felt={skjema.felter.borMedAndreForelderCheckbox}
                                    visFeilmeldinger={skjema.visFeilmeldinger}
                                    label={<TekstBlock block={naarFlyttetFraAndreForelder.checkboxLabel} />}
                                />
                            )}
                        </div>
                    )}
                </>
            )}
        </Steg>
    ) : null;
};

export default OmBarnet;
