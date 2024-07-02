import React from 'react';

import { ITidligereSamboer } from '../../../typer/person';
import { trimWhiteSpace, visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import { SkjemaFeiloppsummering } from '../../Felleskomponenter/SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../../Felleskomponenter/SkjemaModal/SkjemaModal';

import SamboerSkjema from './SamboerSkjema';
import { TidligereSamboerSpørsmålId } from './spørsmål';
import { useTidligereSamboer } from './useTidligereSamboer';

interface Props {
    leggTilTidligereSamboer: (samboer: ITidligereSamboer) => void;
    lukkModal: () => void;
    erÅpen: boolean;
    forklaring?: string;
}

const LeggTilSamboerModal: React.FC<Props> = ({
    leggTilTidligereSamboer,
    lukkModal,
    erÅpen,
    forklaring = undefined,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useTidligereSamboer();

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        leggTilTidligereSamboer({
            navn: {
                id: TidligereSamboerSpørsmålId.tidligereSamboerNavn,
                svar: trimWhiteSpace(skjema.felter.tidligereSamboerNavn.verdi),
            },
            ident: {
                id: TidligereSamboerSpørsmålId.tidligereSamboerFnr,
                svar: svarForSpørsmålMedUkjent(
                    skjema.felter.tidligereSamboerFnrUkjent,
                    skjema.felter.tidligereSamboerFnr
                ),
            },
            fødselsdato: {
                id: TidligereSamboerSpørsmålId.tidligereSamboerFødselsdato,
                svar: svarForSpørsmålMedUkjent(
                    skjema.felter.tidligereSamboerFødselsdatoUkjent,
                    skjema.felter.tidligereSamboerFødselsdato
                ),
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
        lukkModal();
        nullstillSkjema();
    };

    return (
        <SkjemaModal
            modalTittelSpråkId={'omdeg.leggtilfleresamboere.leggtil'}
            submitKnappSpråkId={'omdeg.leggtilfleresamboere.leggtil'}
            forklaring={forklaring}
            erÅpen={erÅpen}
            lukkModal={lukkModal}
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
                erIModal
            />
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
export default LeggTilSamboerModal;
