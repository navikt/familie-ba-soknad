import React from 'react';

import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IArbeidsperiode } from '../../../typer/perioder';
import { IDinLivssituasjonFeltTyper, IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { ArbeidsperiodeModal } from '../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeModal';
import { ArbeidsperiodeOppsummering } from '../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import {
    arbeidsperiodeFeilmelding,
    arbeidsperiodeFlereSpørsmål,
    arbeidsperiodeLeggTilFlereKnapp,
} from '../../Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId } from '../../Felleskomponenter/Arbeidsperiode/spørsmål';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

interface Props {
    skjema: ISkjema<IDinLivssituasjonFeltTyper | IOmBarnetUtvidetFeltTyper, string>;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    gjelderUtlandet?: boolean;
    andreForelderData?: { erDød: boolean };
    barnetsNavn?: string;
    arbeiderEllerArbeidetFelt: Felt<ESvar | null>;
    registrerteArbeidsperioder: Felt<IArbeidsperiode[]>;
    arbeidsperiodeSpørsmålSpråkId: string;
    inkluderVetIkke?: boolean;
}

export const Arbeidsperiode: React.FC<Props> = props => {
    const {
        skjema,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        gjelderUtlandet = false,
        andreForelderData,
        barnetsNavn,
        arbeiderEllerArbeidetFelt,
        registrerteArbeidsperioder,
        arbeidsperiodeSpørsmålSpråkId,
        inkluderVetIkke = false,
    } = props;
    const gjelderAndreForelder = !!andreForelderData;
    const { erÅpen: arbeidsmodalErÅpen, toggleModal: toggleArbeidsmodal } = useModal();

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={arbeiderEllerArbeidetFelt}
                spørsmålTekstId={arbeidsperiodeSpørsmålSpråkId}
                inkluderVetIkke={inkluderVetIkke}
                språkValues={{ navn: barnetsNavn }}
            />
            {arbeiderEllerArbeidetFelt.verdi === ESvar.JA && (
                <>
                    {registrerteArbeidsperioder.verdi.map((periode, index) => (
                        <ArbeidsperiodeOppsummering
                            key={index}
                            arbeidsperiode={periode}
                            fjernPeriodeCallback={fjernArbeidsperiode}
                            nummer={index + 1}
                            gjelderUtlandet={true}
                            andreForelderData={andreForelderData}
                        />
                    ))}
                    {registrerteArbeidsperioder.verdi.length > 0 && (
                        <Element>
                            <SpråkTekst
                                id={arbeidsperiodeFlereSpørsmål(
                                    gjelderUtlandet,
                                    gjelderAndreForelder
                                )}
                                values={{ barn: barnetsNavn }}
                            />
                        </Element>
                    )}
                    <LeggTilKnapp
                        onClick={toggleArbeidsmodal}
                        språkTekst={arbeidsperiodeLeggTilFlereKnapp(gjelderUtlandet)}
                        id={ArbeidsperiodeSpørsmålsId.arbeidsperioder}
                        feilmelding={
                            registrerteArbeidsperioder.erSynlig &&
                            registrerteArbeidsperioder.feilmelding &&
                            skjema.visFeilmeldinger && (
                                <SpråkTekst id={arbeidsperiodeFeilmelding(gjelderUtlandet)} />
                            )
                        }
                    />
                    <ArbeidsperiodeModal
                        erÅpen={arbeidsmodalErÅpen}
                        toggleModal={toggleArbeidsmodal}
                        onLeggTilArbeidsperiode={leggTilArbeidsperiode}
                        gjelderUtlandet
                        andreForelderData={andreForelderData}
                    />
                </>
            )}
        </>
    );
};
