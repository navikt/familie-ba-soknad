import React from 'react';

import { Label } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IArbeidsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import {
    IDinLivssituasjonFeltTyper,
    IEøsForBarnFeltTyper,
    IEøsForSøkerFeltTyper,
    IOmBarnetFeltTyper,
} from '../../../typer/skjema';
import { genererPeriodeId } from '../../../utils/perioder';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import Tilleggsinformasjon from '../Tilleggsinformasjon';
import { useApp } from '../../../context/AppContext';

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
        | IDinLivssituasjonFeltTyper
        | IOmBarnetFeltTyper
        | IEøsForSøkerFeltTyper
        | IEøsForBarnFeltTyper,
        string
    >;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    gjelderUtlandet?: boolean;
    arbeiderEllerArbeidetFelt: Felt<ESvar | null>;
    registrerteArbeidsperioder: Felt<IArbeidsperiode[]>;
}

type Props = ArbeidsperiodeProps & PeriodePersonTypeMedBarnProps;

export const Arbeidsperiode: React.FC<Props> = ({
    skjema,
    leggTilArbeidsperiode,
    fjernArbeidsperiode,
    gjelderUtlandet = false,
    arbeiderEllerArbeidetFelt,
    registrerteArbeidsperioder,
    personType,
    erDød,
    barn,
}) => {
    const { tekster, plainTekst } = useApp();
    const {
        erÅpen: arbeidsmodalErÅpen,
        lukkModal: lukkArbeidsmodal,
        åpneModal: åpneArbeidsmodal,
    } = useModal();
    const barnetsNavn = !!barn && barn.navn;
    const arbeidsperiodeSpørsmålId = gjelderUtlandet
        ? ArbeidsperiodeSpørsmålsId.arbeidsperioderUtland
        : ArbeidsperiodeSpørsmålsId.arbeidsperioderNorge;

    /* 
    TODO:  
    1. Lag generisk funksjonalitet for å finne hjelpetekst basert på periodetype (f.eks. arbeidsperiode), antall perioder (f.eks. registrerteArbeidsperioder.verdi.length).
    2. Feature toggle for å bytte mellom visning av hjelpetekst gjennom LeggTilKnapp vs bruk av Label over LeggTilKnapp.
    */
    let leggTilPeriodeKnappHjelpetekst: string | undefined = undefined;

    try {
        const modal = tekster()['FELLES'].modaler.arbeidsperiode[personType];
        leggTilPeriodeKnappHjelpetekst =
            registrerteArbeidsperioder.verdi.length === 0
                ? plainTekst(modal.leggTilPeriodeKnappHjelpetekst)
                : plainTekst(modal.flerePerioder, {
                      gjelderUtland: gjelderUtlandet,
                  });
    } catch (error) {
        console.error('Kunne ikke "Legg til periode-knapp hjelpetekst"', error);
    }

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={arbeiderEllerArbeidetFelt}
                spørsmålTekstId={arbeidsperiodeSpørsmålSpråkId(gjelderUtlandet, personType, erDød)}
                inkluderVetIkke={personType !== PersonType.Søker}
                språkValues={{
                    ...(barnetsNavn && {
                        navn: barnetsNavn,
                        barn: barnetsNavn,
                    }),
                }}
            />
            {arbeiderEllerArbeidetFelt.verdi === ESvar.JA && (
                <Tilleggsinformasjon>
                    {registrerteArbeidsperioder.verdi.map((periode, index) => (
                        <ArbeidsperiodeOppsummering
                            key={`arbeidsperiode-${index}`}
                            arbeidsperiode={periode}
                            fjernPeriodeCallback={fjernArbeidsperiode}
                            nummer={index + 1}
                            gjelderUtlandet={gjelderUtlandet}
                            personType={personType}
                            erDød={personType === PersonType.AndreForelder && erDød}
                        />
                    ))}
                    {/* {registrerteArbeidsperioder.verdi.length > 0 && (
                        <Label as="p" spacing>
                            <SpråkTekst
                                id={arbeidsperiodeFlereSpørsmål(gjelderUtlandet, personType)}
                                values={{
                                    ...(barnetsNavn && { barn: barnetsNavn }),
                                }}
                            />
                        </Label>
                    )} */}
                    <LeggTilKnapp
                        onClick={åpneArbeidsmodal}
                        språkTekst={arbeidsperiodeLeggTilFlereKnapp(gjelderUtlandet)}
                        hjelpetekst={leggTilPeriodeKnappHjelpetekst}
                        id={genererPeriodeId({
                            personType,
                            spørsmålsId: arbeidsperiodeSpørsmålId,
                            barnetsId: barn?.id,
                        })}
                        feilmelding={
                            registrerteArbeidsperioder.erSynlig &&
                            registrerteArbeidsperioder.feilmelding &&
                            skjema.visFeilmeldinger && (
                                <SpråkTekst id={arbeidsperiodeFeilmelding(gjelderUtlandet)} />
                            )
                        }
                    />
                    {arbeidsmodalErÅpen && (
                        <ArbeidsperiodeModal
                            erÅpen={arbeidsmodalErÅpen}
                            lukkModal={lukkArbeidsmodal}
                            onLeggTilArbeidsperiode={leggTilArbeidsperiode}
                            gjelderUtlandet={gjelderUtlandet}
                            personType={personType}
                            erDød={erDød}
                            hjelpetekst={leggTilPeriodeKnappHjelpetekst}
                        />
                    )}
                </Tilleggsinformasjon>
            )}
        </>
    );
};
