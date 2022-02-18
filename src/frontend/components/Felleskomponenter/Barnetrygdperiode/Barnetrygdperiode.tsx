import React from 'react';

import { useIntl } from 'react-intl';

import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IEøsBarnetrygdsperiode } from '../../../typer/perioder';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { barnetsNavnValue } from '../../../utils/barn';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../SøknadsSteg/OmBarnet/spørsmål';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { BarnetrygdperiodeModal } from './BarnetrygdperiodeModal';
import { BarnetrygdsperiodeOppsummering } from './BarnetrygdperiodeOppsummering';
import { BarnetrygdperiodeSpørsmålId } from './spørsmål';

interface BarnetrygdperiodeProps {
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    registrerteEøsBarnetrygdsperioder: Felt<IEøsBarnetrygdsperiode[]>;
    leggTilBarnetrygdsperiode: (periode: IEøsBarnetrygdsperiode) => void;
    fjernBarnetrygdsperiode: (periode: IEøsBarnetrygdsperiode) => void;
    barn: IBarnMedISøknad;
}

export const Barnetrygdperiode: React.FC<BarnetrygdperiodeProps> = ({
    skjema,
    registrerteEøsBarnetrygdsperioder,
    leggTilBarnetrygdsperiode,
    fjernBarnetrygdsperiode,
    barn,
}) => {
    const { erÅpen: barnetrygdsmodalErÅpen, toggleModal: toggleBarnetrygdsmodal } = useModal();
    const intl = useIntl();

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={skjema.felter.mottarEllerMottokEøsBarnetrygd}
                spørsmålTekstId={
                    omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.mottarEllerMottokEøsBarnetrygd]
                }
            />
            {skjema.felter.mottarEllerMottokEøsBarnetrygd.verdi === ESvar.JA && (
                <>
                    {registrerteEøsBarnetrygdsperioder.verdi.map((periode, index) => (
                        <BarnetrygdsperiodeOppsummering
                            key={`eøs-barnetrygdsperiode-${index}`}
                            barnetrygdsperiode={periode}
                            fjernPeriodeCallback={fjernBarnetrygdsperiode}
                            nummer={index + 1}
                            barnetsNavn={barnetsNavnValue(barn, intl)}
                        />
                    ))}

                    {registrerteEøsBarnetrygdsperioder.verdi.length > 0 && (
                        <Element>
                            <SpråkTekst id={'ombarnet.trygdandreperioder.spm'} />
                        </Element>
                    )}

                    <LeggTilKnapp
                        onClick={toggleBarnetrygdsmodal}
                        språkTekst={'ombarnet.trygdandreperioder.knapp'}
                        id={BarnetrygdperiodeSpørsmålId.barnetrygdsperiodeEøs}
                        feilmelding={
                            registrerteEøsBarnetrygdsperioder.erSynlig &&
                            registrerteEøsBarnetrygdsperioder.feilmelding &&
                            skjema.visFeilmeldinger && (
                                <SpråkTekst id={'ombarnet.trygdandreperioder.feilmelding'} />
                            )
                        }
                    />
                    <BarnetrygdperiodeModal
                        erÅpen={barnetrygdsmodalErÅpen}
                        toggleModal={toggleBarnetrygdsmodal}
                        onLeggTilBarnetrygdsperiode={leggTilBarnetrygdsperiode}
                        barn={barn}
                    />
                </>
            )}
        </>
    );
};
