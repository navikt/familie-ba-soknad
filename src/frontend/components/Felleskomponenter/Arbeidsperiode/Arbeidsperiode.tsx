import React from 'react';

import { useIntl } from 'react-intl';

import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IArbeidsperiode } from '../../../typer/perioder';
import {
    IDinLivssituasjonFeltTyper,
    IEøsForSøkerFeltTyper,
    IOmBarnetUtvidetFeltTyper,
} from '../../../typer/skjema';
import { barnetsNavnValue } from '../../../utils/barn';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { ArbeidsperiodeModal } from './ArbeidsperiodeModal';
import { ArbeidsperiodeOppsummering } from './ArbeidsperiodeOppsummering';
import {
    arbeidsperiodeFeilmelding,
    arbeidsperiodeFlereSpørsmål,
    arbeidsperiodeLeggTilFlereKnapp,
    arbeidsperiodeSpørsmålSpråkId,
} from './arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId } from './spørsmål';

interface ArbeidsperiodeProps {
    skjema: ISkjema<
        IDinLivssituasjonFeltTyper | IOmBarnetUtvidetFeltTyper | IEøsForSøkerFeltTyper,
        string
    >;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    gjelderUtlandet?: boolean;
    andreForelderData?: { erDød: boolean; barn: IBarnMedISøknad };
    arbeiderEllerArbeidetFelt: Felt<ESvar | null>;
    registrerteArbeidsperioder: Felt<IArbeidsperiode[]>;
}

export const Arbeidsperiode: React.FC<ArbeidsperiodeProps> = ({
    skjema,
    leggTilArbeidsperiode,
    fjernArbeidsperiode,
    gjelderUtlandet = false,
    andreForelderData,
    arbeiderEllerArbeidetFelt,
    registrerteArbeidsperioder,
}) => {
    const { erÅpen: arbeidsmodalErÅpen, toggleModal: toggleArbeidsmodal } = useModal();
    const intl = useIntl();

    const gjelderAndreForelder = !!andreForelderData;
    const barn = andreForelderData?.barn;

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={arbeiderEllerArbeidetFelt}
                spørsmålTekstId={arbeidsperiodeSpørsmålSpråkId(gjelderAndreForelder)}
                inkluderVetIkke={gjelderAndreForelder}
                språkValues={{
                    ...(barn && { navn: barnetsNavnValue(barn, intl) }),
                }}
            />
            {arbeiderEllerArbeidetFelt.verdi === ESvar.JA && (
                <>
                    {registrerteArbeidsperioder.verdi.map((periode, index) => (
                        <ArbeidsperiodeOppsummering
                            key={`arbeidsperiode-${index}`}
                            arbeidsperiode={periode}
                            fjernPeriodeCallback={fjernArbeidsperiode}
                            nummer={index + 1}
                            gjelderUtlandet={gjelderUtlandet}
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
                                values={{
                                    ...(barn && { barn: barnetsNavnValue(barn, intl) }),
                                }}
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
