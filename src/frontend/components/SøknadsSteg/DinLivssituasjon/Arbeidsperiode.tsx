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
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

interface Props {
    skjema: ISkjema<IDinLivssituasjonFeltTyper | IOmBarnetUtvidetFeltTyper, string>;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    gjelderUtlandet?: boolean;
    andreForelderData?: { erDød: boolean };
    gjelderAndreForelder?: boolean;
    barnetsNavn?: string;
    tilhørendeJaNeiFelt: Felt<ESvar | null>;
    registrerteArbeidsperioder: Felt<IArbeidsperiode[]>;
}

export const Arbeidsperiode: React.FC<Props> = props => {
    const {
        skjema,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        gjelderUtlandet = false,
        andreForelderData,
        barnetsNavn,
        tilhørendeJaNeiFelt,
        registrerteArbeidsperioder,
    } = props;
    const gjelderAndreForelder = !!andreForelderData;
    const { erÅpen: arbeidsmodalErÅpen, toggleModal: toggleArbeidsmodal } = useModal();

    return (
        <>
            {tilhørendeJaNeiFelt.verdi === ESvar.JA && (
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
