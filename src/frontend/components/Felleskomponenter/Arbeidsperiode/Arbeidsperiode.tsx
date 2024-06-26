import React from 'react';

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
import { hentPeriodeKnappHjelpetekst } from '../../../utils/modaler';
import { genererPeriodeId } from '../../../utils/perioder';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import Tilleggsinformasjon from '../Tilleggsinformasjon';

import { ArbeidsperiodeModal } from './ArbeidsperiodeModal';
import { ArbeidsperiodeOppsummering } from './ArbeidsperiodeOppsummering';
import {
    arbeidsperiodeFeilmelding,
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
    const {
        erÅpen: arbeidsmodalErÅpen,
        lukkModal: lukkArbeidsmodal,
        åpneModal: åpneArbeidsmodal,
    } = useModal();
    const barnetsNavn = !!barn && barn.navn;
    const arbeidsperiodeSpørsmålId = gjelderUtlandet
        ? ArbeidsperiodeSpørsmålsId.arbeidsperioderUtland
        : ArbeidsperiodeSpørsmålsId.arbeidsperioderNorge;

    // TODO: Feature toggle for å bytte mellom visning av hjelpetekst gjennom LeggTilKnapp vs bruk av Label over LeggTilKnapp.
    const antallPerioder = registrerteArbeidsperioder.verdi.length;
    const leggTilPeriodeKnappHjelpetekst = hentPeriodeKnappHjelpetekst(
        'arbeidsperiode',
        personType,
        antallPerioder,
        undefined,
        {
            gjelderUtland: gjelderUtlandet,
        }
    );

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
