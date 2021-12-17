import React from 'react';

import { IBarnMedISøknad } from '../../../typer/søknad';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import {
    utbetalingerAndreForelderSpørsmålSpråkId,
    UtbetalingerSpørsmålId,
    utbetalingerSøkerSpørsmålSpråkId,
} from './spørsmål';
import { useUtbetalingerSkjema } from './useUtbetalingerSkjema';

type IUtbetaling = {};

interface UtbetalingerModalProps {
    erÅpen: boolean;
    toggleModal: () => void;
    onLeggTilUtbetalinger: (utbetaling: IUtbetaling) => void;
    barnetsNavn?: IBarnMedISøknad;
    gjelderAndreForelder?: boolean;
}

export const UtbetalingerModal: React.FC<UtbetalingerModalProps> = ({
    erÅpen,
    toggleModal,
    onLeggTilUtbetalinger,
    barnetsNavn,
    gjelderAndreForelder = false,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useUtbetalingerSkjema(gjelderAndreForelder);

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        // Legg til utbetalinger på søknadsobjekt
        // onLeggTilUtbetalinger()

        toggleModal();
        nullstillSkjema();
    };

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={'felles.flereytelser.tittel'}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'felles.flereytelser.tittel'}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.fårUtbetalingNå}
                    spørsmålTekstId={
                        gjelderAndreForelder
                            ? utbetalingerAndreForelderSpørsmålSpråkId[
                                  UtbetalingerSpørsmålId.fårUtbetalingNå
                              ]
                            : utbetalingerSøkerSpørsmålSpråkId[
                                  UtbetalingerSpørsmålId.fårUtbetalingNå
                              ]
                    }
                />
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
