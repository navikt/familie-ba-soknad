import React from 'react';

import { Alert } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { IEøsBarnetrygdsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IBarnetrygdsperiodeTekstinnhold } from '../../../typer/sanity/modaler/barnetrygdperiode';
import { dagenEtterDato, dagensDato, gårsdagensDato, stringTilDate } from '../../../utils/dato';
import { trimWhiteSpace, visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import TekstBlock from '../Sanity/TekstBlock';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInput } from '../SkjemaFeltInput/SkjemaFeltInput';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

import { barnetrygdperiodeModalSpørsmålSpråkId } from './barnetrygdperiodeSpråkUtils';
import { BarnetrygdperiodeSpørsmålId } from './spørsmål';
import {
    IUsePensjonsperiodeSkjemaParams,
    useBarnetrygdperiodeSkjema,
} from './useBarnetrygdperiodeSkjema';

interface Props extends IUsePensjonsperiodeSkjemaParams {
    erÅpen: boolean;
    lukkModal: () => void;
    onLeggTilBarnetrygdsperiode: (periode: IEøsBarnetrygdsperiode) => void;
    forklaring?: string;
}

export const BarnetrygdperiodeModal: React.FC<Props> = ({
    erÅpen,
    lukkModal,
    onLeggTilBarnetrygdsperiode,
    barn,
    personType,
    erDød = false,
    forklaring = undefined,
}) => {
    const { tekster } = useApp();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useBarnetrygdperiodeSkjema(personType, barn, erDød);

    const teksterForModal: IBarnetrygdsperiodeTekstinnhold =
        tekster().FELLES.modaler.barnetrygdsperiode[personType];

    const {
        mottarEøsBarnetrygdNå,
        barnetrygdsland,
        fraDatoBarnetrygdperiode,
        tilDatoBarnetrygdperiode,
        månedligBeløp,
    } = skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilBarnetrygdsperiode({
            mottarEøsBarnetrygdNå: {
                id: BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå,
                svar: mottarEøsBarnetrygdNå.verdi,
            },
            barnetrygdsland: {
                id: BarnetrygdperiodeSpørsmålId.barnetrygdsland,
                svar: barnetrygdsland.verdi,
            },
            fraDatoBarnetrygdperiode: {
                id: BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode,
                svar: fraDatoBarnetrygdperiode.verdi,
            },
            tilDatoBarnetrygdperiode: {
                id: BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode,
                svar: tilDatoBarnetrygdperiode.erSynlig ? tilDatoBarnetrygdperiode.verdi : '',
            },
            månedligBeløp: {
                id: BarnetrygdperiodeSpørsmålId.månedligBeløp,
                svar: trimWhiteSpace(månedligBeløp.verdi),
            },
        });

        lukkModal();
        nullstillSkjema();
    };

    const periodenErAvsluttet =
        mottarEøsBarnetrygdNå.verdi === ESvar.NEI ||
        (personType === PersonType.AndreForelder && erDød);

    const hentSpørsmålTekstId = barnetrygdperiodeModalSpørsmålSpråkId(
        personType,
        periodenErAvsluttet
    );

    const spørsmålSpråkTekst = (spørsmålId: BarnetrygdperiodeSpørsmålId) => (
        <SpråkTekst id={hentSpørsmålTekstId(spørsmålId)} values={{ barn: barn.navn }} />
    );

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
            <JaNeiSpm
                skjema={skjema}
                felt={skjema.felter.mottarEøsBarnetrygdNå}
                spørsmålTekstId={hentSpørsmålTekstId(
                    BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå
                )}
                språkValues={{ barn: barn.navn }}
            />
            {barnetrygdsland.erSynlig && (
                <LandDropdown
                    felt={skjema.felter.barnetrygdsland}
                    skjema={skjema}
                    label={spørsmålSpråkTekst(BarnetrygdperiodeSpørsmålId.barnetrygdsland)}
                    kunEøs={true}
                    dynamisk
                    ekskluderNorge
                />
            )}
            {fraDatoBarnetrygdperiode.erSynlig && (
                <Datovelger
                    felt={skjema.felter.fraDatoBarnetrygdperiode}
                    skjema={skjema}
                    label={spørsmålSpråkTekst(BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode)}
                    avgrensMaxDato={periodenErAvsluttet ? gårsdagensDato() : dagensDato()}
                />
            )}
            {tilDatoBarnetrygdperiode.erSynlig && (
                <Datovelger
                    felt={skjema.felter.tilDatoBarnetrygdperiode}
                    skjema={skjema}
                    label={spørsmålSpråkTekst(BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode)}
                    avgrensMinDato={
                        skjema.felter.fraDatoBarnetrygdperiode.verdi
                            ? dagenEtterDato(
                                  stringTilDate(skjema.felter.fraDatoBarnetrygdperiode.verdi)
                              )
                            : undefined
                    }
                    avgrensMaxDato={dagensDato()}
                />
            )}
            {månedligBeløp.erSynlig && (
                <SkjemaFeltInput
                    felt={skjema.felter.månedligBeløp}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    labelSpråkTekstId={hentSpørsmålTekstId(
                        BarnetrygdperiodeSpørsmålId.månedligBeløp
                    )}
                    språkValues={{
                        ...(barn && {
                            barn: barn.navn,
                        }),
                    }}
                    description={
                        <Alert variant={'info'} inline>
                            <SpråkTekst id={'ombarnet.trygdbeløp.info'} />
                        </Alert>
                    }
                    fullbredde={false}
                />
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
