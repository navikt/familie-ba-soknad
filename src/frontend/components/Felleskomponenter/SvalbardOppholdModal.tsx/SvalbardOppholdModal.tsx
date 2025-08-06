import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../context/AppContext';
import { ISvalbardOppholdPeriode } from '../../../typer/perioder';
import { IUtenlandsoppholdTekstinnhold } from '../../../typer/sanity/modaler/utenlandsopphold';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import {
    harTilhørendeFomFelt,
    hentMinAvgrensningPåTilDato,
    hentMaxAvgrensningPåFraDato,
    hentMaxAvgrensningPåTilDato,
} from '../../../utils/utenlandsopphold';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import StyledDropdown from '../Dropdowns/StyledDropdown';
import TekstBlock from '../Sanity/TekstBlock';
import { SkjemaCheckboxForSanity } from '../SkjemaCheckbox/SkjemaCheckboxForSanity';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';

import { useSvalbardOppholdSkjema } from './useSvalbardOppholdSkjema';
import { ISvalbardOppholdTekstinnhold } from '../../../typer/sanity/modaler/svalbardOpphold';
import { SvalbardOppholdSpørsmålId } from './spørsmål';

interface Props {
    erÅpen: boolean;
    lukkModal: () => void;
    onLeggTilSvalbardOppholdPeriode: (periode: ISvalbardOppholdPeriode) => void;
    forklaring?: string;
}

export const SvalbardOppholdModal: React.FC<Props> = ({
    erÅpen,
    lukkModal,
    onLeggTilSvalbardOppholdPeriode,
    forklaring = undefined,
}) => {
    const { tekster, plainTekst } = useAppContext();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useSvalbardOppholdSkjema();

    const teksterForModal: ISvalbardOppholdTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.svalbardOpphold;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilSvalbardOppholdPeriode({
            fraDatoSvalbardOpphold: {
                id: SvalbardOppholdSpørsmålId.fraDato,
                svar: skjema.felter.fraDatoSvalbardOpphold.verdi,
            },
            tilDatoSvalbardOpphold: {
                id: SvalbardOppholdSpørsmålId.tilDato,
                svar: skjema.felter.tilDatoSvalbardOpphold.verdi,
            },
        });

        lukkModal();
        nullstillSkjema();
    };

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            tittel={teksterForModal.tittel}
            forklaring={forklaring}
            onSubmitCallback={onLeggTil}
            submitKnappTekst={<TekstBlock block={teksterForModal.leggTilKnapp} />}
            lukkModal={lukkModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <StyledDropdown<EUtenlandsoppholdÅrsak | ''>
                {...skjema.felter.utenlandsoppholdÅrsak.hentNavInputProps(skjema.visFeilmeldinger)}
                felt={skjema.felter.utenlandsoppholdÅrsak}
                label={
                    <TekstBlock
                        block={teksterForPersonType.periodeBeskrivelse.sporsmal}
                        flettefelter={{ barnetsNavn: barn?.navn }}
                    />
                }
                skjema={skjema}
                placeholder={plainTekst(teksterForPersonType.valgalternativPlaceholder)}
            >
                {Object.keys(EUtenlandsoppholdÅrsak).map((årsak, number) => (
                    <option key={number} value={årsak}>
                        {plainTekst(
                            hentUtenlandsoppholdÅrsak(
                                årsak as EUtenlandsoppholdÅrsak,
                                teksterForPersonType
                            )
                        )}
                    </option>
                ))}
            </StyledDropdown>
            <LandDropdown
                felt={skjema.felter.oppholdsland}
                skjema={skjema}
                label={
                    <TekstBlock
                        block={hentLandSpørsmål(
                            skjema.felter.utenlandsoppholdÅrsak.verdi,
                            teksterForPersonType
                        )}
                        flettefelter={{ barnetsNavn: barn?.navn }}
                    />
                }
                dynamisk
                ekskluderNorge
            />
            {skjema.felter.oppholdslandFraDato.erSynlig && (
                <Datovelger
                    felt={skjema.felter.oppholdslandFraDato}
                    label={
                        <TekstBlock
                            block={hentFraDatoSpørsmål(
                                skjema.felter.utenlandsoppholdÅrsak.verdi,
                                teksterForPersonType
                            )}
                            flettefelter={{ barnetsNavn: barn?.navn }}
                        />
                    }
                    skjema={skjema}
                    avgrensMaxDato={hentMaxAvgrensningPåFraDato(
                        skjema.felter.utenlandsoppholdÅrsak.verdi
                    )}
                />
            )}
            {(skjema.felter.oppholdslandTilDato.erSynlig ||
                skjema.felter.oppholdslandTilDato.erSynlig) && (
                <div>
                    {skjema.felter.oppholdslandTilDato.erSynlig && (
                        <Datovelger
                            felt={skjema.felter.oppholdslandTilDato}
                            label={
                                <TekstBlock
                                    block={hentTilDatoSpørsmål(
                                        skjema.felter.utenlandsoppholdÅrsak.verdi,
                                        teksterForPersonType
                                    )}
                                    flettefelter={{ barnetsNavn: barn?.navn }}
                                />
                            }
                            skjema={skjema}
                            avgrensMinDato={hentMinAvgrensningPåTilDato(
                                skjema.felter.utenlandsoppholdÅrsak.verdi
                            )}
                            avgrensMaxDato={hentMaxAvgrensningPåTilDato(
                                skjema.felter.utenlandsoppholdÅrsak.verdi
                            )}
                            tilhørendeFraOgMedFelt={
                                harTilhørendeFomFelt(skjema.felter.utenlandsoppholdÅrsak.verdi)
                                    ? skjema.felter.oppholdslandFraDato
                                    : undefined
                            }
                            disabled={skjema.felter.oppholdslandTilDatoUkjent.verdi === ESvar.JA}
                        />
                    )}
                    {skjema.felter.oppholdslandTilDatoUkjent.erSynlig && (
                        <SkjemaCheckboxForSanity
                            felt={skjema.felter.oppholdslandTilDatoUkjent}
                            label={plainTekst(teksterForPersonType.sluttdatoFremtid.checkboxLabel)}
                        />
                    )}
                </div>
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
