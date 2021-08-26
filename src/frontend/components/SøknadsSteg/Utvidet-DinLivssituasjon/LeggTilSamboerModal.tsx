import React from 'react';

import { ITidligereSamboer } from '../../../typer/person';
import SkjemaModal from '../../Felleskomponenter/SkjemaModal/SkjemaModal';
import SamboerSkjema from './SamboerSkjema';
import { TidligereSamboerSpørsmålId } from './spørsmål';
import { useTidligereSamboer } from './useTidligereSamboer';

interface Props {
    leggTilTidligereSamboer: (samboer: ITidligereSamboer) => void;
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
        leggTilTidligereSamboer({
            navn: {
                id: TidligereSamboerSpørsmålId.tidligereSamboerNavn,
                svar: skjema.felter.tidligereSamboerNavn.verdi,
            },
            ident: {
                id: TidligereSamboerSpørsmålId.tidligereSamboerFnr,
                svar: skjema.felter.tidligereSamboerFnr.verdi,
            },
            fødselsdato: {
                id: TidligereSamboerSpørsmålId.tidligereSamboerFødselsdato,
                svar: skjema.felter.tidligereSamboerFødselsdato.verdi,
            },
            samboerFraDato: {
                id: TidligereSamboerSpørsmålId.tidligereSamboerFraDato,
                svar: skjema.felter.tidligereSamboerFraDato.verdi,
            },
            samboerTilDato: {
                id: TidligereSamboerSpørsmålId.tidligereSamboerTilDato,
                svar: skjema.felter.tidligereSamboerTilDato.verdi,
            },
        });
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
