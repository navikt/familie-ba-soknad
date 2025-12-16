import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { ESanitySteg } from '../../../../common/sanity';
import { useAppContext } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { IUtenlandsoppholdTekstinnhold } from '../../../typer/sanity/modaler/utenlandsopphold';
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
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';

import { UtenlandsoppholdSpørsmålId } from './spørsmål';
import { IUseUtenlandsoppholdSkjemaParams, useUtenlandsoppholdSkjema } from './useUtenlandsoppholdSkjema';
import {
    hentFraDatoSpørsmål,
    hentLandSpørsmål,
    hentTilDatoSpørsmål,
    hentUtenlandsoppholdÅrsak,
} from './utenlandsoppholdSpråkUtils';

interface Props extends IUseUtenlandsoppholdSkjemaParams {
    erÅpen: boolean;
    lukkModal: () => void;
    onLeggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    barn?: IBarnMedISøknad;
    forklaring?: string;
}

export const UtenlandsoppholdModal: React.FC<Props> = ({
    erÅpen,
    lukkModal,
    onLeggTilUtenlandsperiode,
    personType,
    barn,
    forklaring = undefined,
}) => {
    const { tekster, plainTekst } = useAppContext();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } = useUtenlandsoppholdSkjema({
        personType,
        barn,
    });

    const teksterForPersonType: IUtenlandsoppholdTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.utenlandsopphold[personType];

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilUtenlandsperiode({
            utenlandsoppholdÅrsak: {
                id: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
                svar: skjema.felter.utenlandsoppholdÅrsak.verdi as EUtenlandsoppholdÅrsak,
            },
            oppholdsland: {
                id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold,
                svar: skjema.felter.oppholdsland.verdi,
            },
            ...(skjema.felter.oppholdslandFraDato.erSynlig && {
                oppholdslandFraDato: {
                    id: UtenlandsoppholdSpørsmålId.fraDatoUtenlandsopphold,
                    svar: skjema.felter.oppholdslandFraDato.verdi,
                },
            }),
            ...(skjema.felter.oppholdslandTilDato.erSynlig && {
                oppholdslandTilDato: {
                    id: UtenlandsoppholdSpørsmålId.tilDatoUtenlandsopphold,
                    svar: svarForSpørsmålMedUkjent(
                        skjema.felter.oppholdslandTilDatoUkjent,
                        skjema.felter.oppholdslandTilDato
                    ),
                },
            }),
        });

        lukkModal();
        nullstillSkjema();
    };

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            tittel={teksterForPersonType.tittel}
            flettefelter={{ barnetsNavn: barn?.navn }}
            forklaring={forklaring}
            onSubmitCallback={onLeggTil}
            submitKnappTekst={<TekstBlock block={teksterForPersonType.leggTilKnapp} />}
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
                        {plainTekst(hentUtenlandsoppholdÅrsak(årsak as EUtenlandsoppholdÅrsak, teksterForPersonType))}
                    </option>
                ))}
            </StyledDropdown>
            <LandDropdown
                felt={skjema.felter.oppholdsland}
                skjema={skjema}
                label={
                    <TekstBlock
                        block={hentLandSpørsmål(skjema.felter.utenlandsoppholdÅrsak.verdi, teksterForPersonType)}
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
                            block={hentFraDatoSpørsmål(skjema.felter.utenlandsoppholdÅrsak.verdi, teksterForPersonType)}
                            flettefelter={{ barnetsNavn: barn?.navn }}
                        />
                    }
                    skjema={skjema}
                    avgrensMaxDato={hentMaxAvgrensningPåFraDato(skjema.felter.utenlandsoppholdÅrsak.verdi)}
                />
            )}
            {(skjema.felter.oppholdslandTilDato.erSynlig || skjema.felter.oppholdslandTilDato.erSynlig) && (
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
                            avgrensMinDato={hentMinAvgrensningPåTilDato(skjema.felter.utenlandsoppholdÅrsak.verdi)}
                            avgrensMaxDato={hentMaxAvgrensningPåTilDato(skjema.felter.utenlandsoppholdÅrsak.verdi)}
                            tilhørendeFraOgMedFelt={
                                harTilhørendeFomFelt(skjema.felter.utenlandsoppholdÅrsak.verdi)
                                    ? skjema.felter.oppholdslandFraDato
                                    : undefined
                            }
                            disabled={skjema.felter.oppholdslandTilDatoUkjent.verdi === ESvar.JA}
                        />
                    )}
                    {skjema.felter.oppholdslandTilDatoUkjent.erSynlig && (
                        <SkjemaCheckbox
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
