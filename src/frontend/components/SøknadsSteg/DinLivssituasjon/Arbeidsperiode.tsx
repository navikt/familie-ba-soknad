import React from 'react';

import { useIntl } from 'react-intl';

import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IArbeidsperiode } from '../../../typer/perioder';
import { IDinLivssituasjonFeltTyper, IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { barnetsNavnValue } from '../../../utils/barn';
import { ArbeidsperiodeModal } from '../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeModal';
import { ArbeidsperiodeOppsummering } from '../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import {
    arbeidsperiodeFeilmelding,
    arbeidsperiodeFlereSpørsmål,
    arbeidsperiodeLeggTilFlereKnapp,
    arbeidsperiodeSpørsmålSpråkId,
} from '../../Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId } from '../../Felleskomponenter/Arbeidsperiode/spørsmål';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

interface ArbeidsperiodeProps {
    skjema: ISkjema<IDinLivssituasjonFeltTyper | IOmBarnetUtvidetFeltTyper, string>;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    gjelderUtlandet?: boolean;
    andreForelderData?: { erDød: boolean; barn: IBarnMedISøknad };
    barnetsNavn?: string;
    arbeiderEllerArbeidetFelt: Felt<ESvar | null>;
    registrerteArbeidsperioder: Felt<IArbeidsperiode[]>;
    inkluderVetIkke?: boolean;
}

export const Arbeidsperiode: React.FC<ArbeidsperiodeProps> = ({
    skjema,
    leggTilArbeidsperiode,
    fjernArbeidsperiode,
    gjelderUtlandet = false,
    andreForelderData,
    arbeiderEllerArbeidetFelt,
    registrerteArbeidsperioder,
    inkluderVetIkke = false,
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
                inkluderVetIkke={inkluderVetIkke}
                språkValues={{
                    ...(barn && { navn: barnetsNavnValue(barn, intl) }),
                }}
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
