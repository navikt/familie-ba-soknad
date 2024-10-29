import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { IBarnMedISøknad } from '../../../typer/barn';
import { IUtenlandsperiode } from '../../../typer/perioder';
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
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

import { tilDatoUkjentLabelSpråkId, UtenlandsoppholdSpørsmålId } from './spørsmål';
import {
    IUseUtenlandsoppholdSkjemaParams,
    useUtenlandsoppholdSkjema,
} from './useUtenlandsoppholdSkjema';
import {
    fraDatoLabelSpråkId,
    landLabelSpråkId,
    tilDatoLabelSpråkId,
    årsakLabelSpråkId,
    årsakSpråkId,
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
    const { tekster } = useApp();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useUtenlandsoppholdSkjema({
            personType,
            barn,
        });

    const teksterForPersonType = tekster()[ESanitySteg.FELLES].modaler.utenlandsopphold[personType];

    console.log(teksterForPersonType);

    const { formatMessage } = useIntl();

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
                    <SpråkTekst
                        id={årsakLabelSpråkId(barn)}
                        values={{ ...(barn && { barn: barn.navn }) }}
                    />
                }
                skjema={skjema}
                placeholder={formatMessage({ id: 'felles.velg-årsak.placeholder' })}
            >
                {Object.keys(EUtenlandsoppholdÅrsak).map((årsak, number) => (
                    <option key={number} value={årsak}>
                        {formatMessage(
                            {
                                id: årsakSpråkId(årsak as EUtenlandsoppholdÅrsak, barn),
                            },
                            { ...(barn && { barn: barn.navn }) }
                        )}
                    </option>
                ))}
            </StyledDropdown>
            <LandDropdown
                felt={skjema.felter.oppholdsland}
                skjema={skjema}
                label={
                    landLabelSpråkId(skjema.felter.utenlandsoppholdÅrsak.verdi, barn) && (
                        <SpråkTekst
                            id={landLabelSpråkId(skjema.felter.utenlandsoppholdÅrsak.verdi, barn)}
                            values={{ ...(barn && { barn: barn.navn }) }}
                        />
                    )
                }
                dynamisk
                ekskluderNorge
            />
            {skjema.felter.oppholdslandFraDato.erSynlig && (
                <Datovelger
                    felt={skjema.felter.oppholdslandFraDato}
                    label={
                        <SpråkTekst
                            id={fraDatoLabelSpråkId(
                                skjema.felter.utenlandsoppholdÅrsak.verdi,
                                barn
                            )}
                            values={{ ...(barn && { barn: barn.navn }) }}
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
                                <SpråkTekst
                                    id={tilDatoLabelSpråkId(
                                        skjema.felter.utenlandsoppholdÅrsak.verdi,
                                        barn
                                    )}
                                    values={{ ...(barn && { barn: barn.navn }) }}
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
                        <SkjemaCheckbox
                            felt={skjema.felter.oppholdslandTilDatoUkjent}
                            labelSpråkTekstId={tilDatoUkjentLabelSpråkId}
                        />
                    )}
                </div>
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
