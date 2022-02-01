import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { IArbeidsperiode, IBarnetrygdperiode } from '../../../typer/perioder';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import useModal from '../SkjemaModal/useModal';

interface Props extends ReturnType<typeof useModal> {
    onLeggTilBarnetrygdperiode: (periode: IBarnetrygdperiode) => void;
    gjelderUtlandet: boolean;
    andreForelderData?: { erDød: boolean };
}

export const ArbeidsperiodeModal: React.FC<Props> = ({
    erÅpen,
    toggleModal,
    onLeggTilArbeidsperiode,
    gjelderUtlandet = false,
    andreForelderData,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useArbeidsperiodeSkjema();

    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeLand,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
        tilDatoArbeidsperiodeUkjent,
    } = skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilArbeidsperiode({});
        console.log('barnetrygdperioder');
        toggleModal();
        nullstillSkjema();
    };

    const modalTittel = gjelderUtlandet ? 'TODO' : 'fTODO ';

    const tilbakeITid = arbeidsperiodeAvsluttet.verdi === ESvar.JA;

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={modalTittel}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'felles.leggtilarbeidsperiode.knapp'}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline></KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
