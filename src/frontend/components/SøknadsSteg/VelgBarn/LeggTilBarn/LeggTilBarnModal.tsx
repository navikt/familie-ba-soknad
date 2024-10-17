import React from 'react';

import { Alert, Fieldset } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import { Valideringsstatus } from '@navikt/familie-skjema';

import { useApp } from '../../../../context/AppContext';
import { Typografi } from '../../../../typer/sanity/sanity';
import { visFeiloppsummering } from '../../../../utils/hjelpefunksjoner';
import JaNeiSpmForSanity from '../../../Felleskomponenter/JaNeiSpm/JaNeiSpmForSanity';
import KomponentGruppe from '../../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import TekstBlock from '../../../Felleskomponenter/Sanity/TekstBlock';
import { SkjemaCheckboxForSanity } from '../../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckboxForSanity';
import { SkjemaFeiloppsummering } from '../../../Felleskomponenter/SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInputForSanity } from '../../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInputForSanity';
import SkjemaModal from '../../../Felleskomponenter/SkjemaModal/SkjemaModal';
import { SøkerMåBrukePDF } from '../../../Felleskomponenter/SøkerMåBrukePDF';

import { useLeggTilBarn } from './useLeggTilBarn';

const LeggTilBarnModal: React.FC<{
    erÅpen: boolean;
    lukkModal: () => void;
}> = ({ erÅpen, lukkModal }) => {
    const { skjema, nullstillSkjema, valideringErOk, leggTilBarn, validerFelterOgVisFeilmelding } =
        useLeggTilBarn();
    const { tekster } = useApp();

    const teksterForLeggTilBarnModal = tekster().FELLES.modaler.leggTilBarn;
    const {
        erBarnetFoedt,
        ikkeFoedtAlert,
        barnetsNavnSubtittel,
        fornavn,
        etternavn,
        foedselsnummerEllerDNummer,
        foedselsnummerAlert,
    } = teksterForLeggTilBarnModal;

    const submitOgLukk = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return;
        }
        leggTilBarn();
        lukkModal();
    };

    return (
        <SkjemaModal
            modalTittelSpråkId={'hvilkebarn.leggtilbarn.modal.tittel'}
            submitKnappSpråkId={'hvilkebarn.leggtilbarn.kort.knapp'}
            erÅpen={erÅpen}
            lukkModal={lukkModal}
            valideringErOk={valideringErOk}
            onSubmitCallback={submitOgLukk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe>
                <JaNeiSpmForSanity
                    skjema={skjema}
                    felt={skjema.felter.erFødt}
                    spørsmålDokument={erBarnetFoedt}
                />
                {skjema.felter.erFødt.verdi === ESvar.NEI && (
                    <Alert variant={'warning'} inline>
                        <TekstBlock block={ikkeFoedtAlert} typografi={Typografi.BodyShort} />
                    </Alert>
                )}
            </KomponentGruppe>
            {skjema.felter.erFødt.valideringsstatus === Valideringsstatus.OK && (
                <>
                    <Fieldset
                        legend={<TekstBlock block={barnetsNavnSubtittel} />}
                        aria-live="polite"
                    >
                        <KomponentGruppe aria-live="polite">
                            <SkjemaFeltInputForSanity
                                felt={skjema.felter.fornavn}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                label={<TekstBlock block={fornavn.sporsmal} />}
                                disabled={skjema.felter.navnetErUbestemt.verdi === ESvar.JA}
                            />
                            <SkjemaFeltInputForSanity
                                felt={skjema.felter.etternavn}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                label={<TekstBlock block={etternavn.sporsmal} />}
                                disabled={skjema.felter.navnetErUbestemt.verdi === ESvar.JA}
                            />
                            <SkjemaCheckboxForSanity
                                felt={skjema.felter.navnetErUbestemt}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                label={<TekstBlock block={etternavn.checkboxLabel} />}
                            />
                        </KomponentGruppe>
                    </Fieldset>
                    <div aria-live="polite">
                        <SkjemaFeltInputForSanity
                            felt={skjema.felter.ident}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            label={<TekstBlock block={foedselsnummerEllerDNummer.sporsmal} />}
                            disabled={skjema.felter.ikkeFåttIdentChecked.verdi === ESvar.JA}
                        />
                        <SkjemaCheckboxForSanity
                            felt={skjema.felter.ikkeFåttIdentChecked}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            label={<TekstBlock block={foedselsnummerEllerDNummer.checkboxLabel} />}
                        />
                    </div>
                </>
            )}
            {skjema.felter.ikkeFåttIdentChecked.verdi === ESvar.JA && (
                <SøkerMåBrukePDF advarselTekst={<TekstBlock block={foedselsnummerAlert} />} />
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};

export default LeggTilBarnModal;
