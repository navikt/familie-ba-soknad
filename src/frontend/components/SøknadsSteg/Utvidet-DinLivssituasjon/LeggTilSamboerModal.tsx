import React from 'react';

import SkjemaModal from '../../Felleskomponenter/SkjemaModal/SkjemaModal';
import SamboerSkjema from './SamboerSkjema';
import { useTidligereSamboer } from './useTidligereSamboer';

interface Props {
    leggTilTidligereSamboer: () => void;
    toggleModal: () => void;
    erÅpen: boolean;
}

const LeggTilSamboerModal: React.FC<Props> = ({ leggTilTidligereSamboer, toggleModal, erÅpen }) => {
    const {
        skjema,
        valideringErOk,
        nullstillSkjema,
        validerFelterOgVisFeilmelding,
    } = useTidligereSamboer();

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        leggTilTidligereSamboer();
        toggleModal();
        nullstillSkjema();
    };

    return (
        <SkjemaModal
            modalTittelSpråkId={'omdeg.leggtilfleresamboere.leggtil'}
            submitKnappSpråkId={'omdeg.leggtilfleresamboere.leggtil'}
            erÅpen={erÅpen}
            toggleModal={toggleModal}
            onSubmitCallback={onLeggTil}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <SamboerSkjema
                skjema={skjema}
                samboerFelter={{
                    navn: skjema.felter.tidligereSamboerNavn,
                    fnr: skjema.felter.tidligereSamboerFnr,
                    fnrUkjent: skjema.felter.tidligereSamboerFnrUkjent,
                    fødselsdato: skjema.felter.tidligereSamboerFødselsdato,
                    fødselsdatoUkjent: skjema.felter.tidligereSamboerFødselsdatoUkjent,
                    samboerFraDato: skjema.felter.tidligereSamboerFraDato,
                    samboerTilDato: skjema.felter.tidligereSamboerTilDato,
                }}
            />
        </SkjemaModal>
    );
};
export default LeggTilSamboerModal;
