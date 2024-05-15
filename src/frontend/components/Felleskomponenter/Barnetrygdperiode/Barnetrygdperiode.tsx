import React from 'react';

import { Label } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IEøsBarnetrygdsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeProps, PersonType } from '../../../typer/personType';
import { IEøsForBarnFeltTyper, IOmBarnetFeltTyper } from '../../../typer/skjema';
import { genererPeriodeId } from '../../../utils/perioder';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

import { BarnetrygdperiodeModal } from './BarnetrygdperiodeModal';
import { BarnetrygdsperiodeOppsummering } from './BarnetrygdperiodeOppsummering';
import {
    barnetrygdperiodeFlereSpørsmål,
    barnetrygdSpørsmålSpråkId,
} from './barnetrygdperiodeSpråkUtils';
import { BarnetrygdperiodeSpørsmålId } from './spørsmål';

interface Props {
    skjema: ISkjema<IOmBarnetFeltTyper | IEøsForBarnFeltTyper, string>;
    registrerteEøsBarnetrygdsperioder: Felt<IEøsBarnetrygdsperiode[]>;
    leggTilBarnetrygdsperiode: (periode: IEøsBarnetrygdsperiode) => void;
    fjernBarnetrygdsperiode: (periode: IEøsBarnetrygdsperiode) => void;
    barn: IBarnMedISøknad;
    tilhørendeJaNeiSpmFelt: Felt<ESvar | null>;
}

type BarnetrygdperiodeProps = Props & PeriodePersonTypeProps;

export const Barnetrygdperiode: React.FC<BarnetrygdperiodeProps> = ({
    skjema,
    registrerteEøsBarnetrygdsperioder,
    leggTilBarnetrygdsperiode,
    fjernBarnetrygdsperiode,
    personType,
    erDød,
    barn,
    tilhørendeJaNeiSpmFelt,
}) => {
    const {
        erÅpen: barnetrygdsmodalErÅpen,
        lukkModal: lukkBarnetrygdsmodal,
        åpneModal: åpneBarnetrygdsmodal,
    } = useModal();

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={tilhørendeJaNeiSpmFelt}
                spørsmålTekstId={barnetrygdSpørsmålSpråkId(personType, erDød)}
                inkluderVetIkke={personType !== PersonType.Søker}
                språkValues={{
                    ...(personType !== PersonType.Søker && {
                        barn: barn.navn,
                    }),
                }}
            />
            {tilhørendeJaNeiSpmFelt.verdi === ESvar.JA && (
                <>
                    {registrerteEøsBarnetrygdsperioder.verdi.map((periode, index) => (
                        <BarnetrygdsperiodeOppsummering
                            key={`eøs-barnetrygdsperiode-${index}`}
                            barnetrygdsperiode={periode}
                            fjernPeriodeCallback={fjernBarnetrygdsperiode}
                            nummer={index + 1}
                            barnetsNavn={barn.navn}
                            personType={personType}
                            erDød={personType === PersonType.AndreForelder && erDød}
                        />
                    ))}

                    {registrerteEøsBarnetrygdsperioder.verdi.length > 0 && (
                        <Label as="p">
                            <SpråkTekst
                                id={barnetrygdperiodeFlereSpørsmål(personType)}
                                values={{ barn: barn.navn }}
                            />
                        </Label>
                    )}

                    <LeggTilKnapp
                        onClick={åpneBarnetrygdsmodal}
                        språkTekst={'ombarnet.trygdandreperioder.knapp'}
                        id={genererPeriodeId({
                            personType,
                            spørsmålsId: BarnetrygdperiodeSpørsmålId.barnetrygdsperiodeEøs,
                            barnetsId: barn.id,
                        })}
                        feilmelding={
                            registrerteEøsBarnetrygdsperioder.erSynlig &&
                            registrerteEøsBarnetrygdsperioder.feilmelding &&
                            skjema.visFeilmeldinger && (
                                <SpråkTekst id={'ombarnet.trygdandreperioder.feilmelding'} />
                            )
                        }
                    />
                    {barnetrygdsmodalErÅpen && (
                        <BarnetrygdperiodeModal
                            erÅpen={barnetrygdsmodalErÅpen}
                            lukkModal={lukkBarnetrygdsmodal}
                            onLeggTilBarnetrygdsperiode={leggTilBarnetrygdsperiode}
                            barn={barn}
                            personType={personType}
                            erDød={erDød}
                        />
                    )}
                </>
            )}
        </>
    );
};
