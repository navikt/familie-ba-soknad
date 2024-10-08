import React from 'react';

import { Alert, Fieldset } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import { Valideringsstatus } from '@navikt/familie-skjema';

import { visFeiloppsummering } from '../../../../utils/hjelpefunksjoner';
import JaNeiSpm from '../../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../../../Felleskomponenter/SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInput } from '../../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SkjemaModal from '../../../Felleskomponenter/SkjemaModal/SkjemaModal';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { SøkerMåBrukePDF } from '../../../Felleskomponenter/SøkerMåBrukePDF';
import { VelgBarnSpørsmålId, velgBarnSpørsmålSpråkId } from '../spørsmål';

import { useLeggTilBarn } from './useLeggTilBarn';

const LeggTilBarnModal: React.FC<{
    erÅpen: boolean;
    lukkModal: () => void;
}> = ({ erÅpen, lukkModal }) => {
    const { skjema, nullstillSkjema, valideringErOk, leggTilBarn, validerFelterOgVisFeilmelding } =
        useLeggTilBarn();

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
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.erFødt}
                    spørsmålTekstId={velgBarnSpørsmålSpråkId[VelgBarnSpørsmålId.leggTilBarnErFødt]}
                />
                {skjema.felter.erFødt.verdi === ESvar.NEI && (
                    <Alert variant={'warning'} inline>
                        <SpråkTekst id={'hvilkebarn.leggtilbarn.barn-ikke-født.alert'} />
                    </Alert>
                )}
            </KomponentGruppe>
            {skjema.felter.erFødt.valideringsstatus === Valideringsstatus.OK && (
                <>
                    <Fieldset
                        legend={
                            <SpråkTekst
                                id={velgBarnSpørsmålSpråkId[VelgBarnSpørsmålId.barnetsNavn]}
                            />
                        }
                        aria-live="polite"
                    >
                        <KomponentGruppe aria-live="polite">
                            <SkjemaFeltInput
                                felt={skjema.felter.fornavn}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                labelSpråkTekstId={
                                    velgBarnSpørsmålSpråkId[VelgBarnSpørsmålId.leggTilBarnFornavn]
                                }
                                disabled={skjema.felter.navnetErUbestemt.verdi === ESvar.JA}
                            />
                            <SkjemaFeltInput
                                felt={skjema.felter.etternavn}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                labelSpråkTekstId={
                                    velgBarnSpørsmålSpråkId[VelgBarnSpørsmålId.leggTilBarnEtternavn]
                                }
                                disabled={skjema.felter.navnetErUbestemt.verdi === ESvar.JA}
                            />
                            <SkjemaCheckbox
                                felt={skjema.felter.navnetErUbestemt}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                labelSpråkTekstId={
                                    velgBarnSpørsmålSpråkId[
                                        VelgBarnSpørsmålId.leggTilBarnNavnIkkeBestemt
                                    ]
                                }
                            />
                        </KomponentGruppe>
                    </Fieldset>
                    <div aria-live="polite">
                        <SkjemaFeltInput
                            felt={skjema.felter.ident}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            labelSpråkTekstId={
                                velgBarnSpørsmålSpråkId[VelgBarnSpørsmålId.leggTilBarnFnr]
                            }
                            disabled={skjema.felter.ikkeFåttIdentChecked.verdi === ESvar.JA}
                        />
                        <SkjemaCheckbox
                            felt={skjema.felter.ikkeFåttIdentChecked}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            labelSpråkTekstId={
                                velgBarnSpørsmålSpråkId[VelgBarnSpørsmålId.leggTilBarnIkkeFåttFnr]
                            }
                        />
                        {skjema.felter.ikkeFåttIdentChecked.verdi === ESvar.JA && (
                            <SøkerMåBrukePDF
                                advarselTekstId={'hvilkebarn.leggtilbarn.ikke-fått-fnr.alert'}
                            />
                        )}
                    </div>
                </>
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};

export default LeggTilBarnModal;
