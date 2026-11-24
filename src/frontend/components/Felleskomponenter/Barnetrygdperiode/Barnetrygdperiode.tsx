import JaNeiSpm from '@components/Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '@components/Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '@components/Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '@components/Felleskomponenter/PerioderContainer';
import TekstBlock from '@components/Felleskomponenter/Sanity/TekstBlock';
import useModal from '@components/Felleskomponenter/SkjemaModal/useModal';
import { useAppContext } from '@context/AppContext';
import { ESvar } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';
import type { IBarnMedISøknad } from '@typer/barn';
import type { IEøsBarnetrygdsperiode } from '@typer/perioder';
import { type PeriodePersonTypeProps, PersonType } from '@typer/personType';
import type { IBarnetrygdsperiodeTekstinnhold } from '@typer/sanity/modaler/barnetrygdperiode';
import type { IEøsForBarnFeltTyper, IOmBarnetFeltTyper } from '@typer/skjema';
import { genererPeriodeId } from '@utils/perioder';
import { uppercaseFørsteBokstav } from '@utils/visning';
import type { FC } from 'react';

import { BarnetrygdperiodeModal } from './BarnetrygdperiodeModal';
import { BarnetrygdsperiodeOppsummering } from './BarnetrygdperiodeOppsummering';
import { barnetrygdSpørsmålDokument } from './barnetrygdperiodeSpråkUtils';
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

export const Barnetrygdperiode: FC<BarnetrygdperiodeProps> = ({
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
    const { tekster, plainTekst } = useAppContext();

    const teksterForPersonType: IBarnetrygdsperiodeTekstinnhold =
        tekster().FELLES.modaler.barnetrygdsperiode[personType];

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    return (
        <KomponentGruppe>
            <JaNeiSpm
                skjema={skjema}
                felt={tilhørendeJaNeiSpmFelt}
                spørsmålDokument={barnetrygdSpørsmålDokument(personType, tekster(), erDød)}
                flettefelter={{ barnetsNavn: barn?.navn }}
                inkluderVetIkke={personType !== PersonType.Søker}
            />
            {tilhørendeJaNeiSpmFelt.verdi === ESvar.JA && (
                <PerioderContainer
                    tittel={uppercaseFørsteBokstav(plainTekst(frittståendeOrdTekster.barnetrygdperioder))}
                >
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
                    <LeggTilKnapp
                        onClick={åpneBarnetrygdsmodal}
                        leggTilFlereTekst={
                            registrerteEøsBarnetrygdsperioder.verdi.length > 0 &&
                            plainTekst(teksterForPersonType.flerePerioder)
                        }
                        id={genererPeriodeId({
                            personType,
                            spørsmålsId: BarnetrygdperiodeSpørsmålId.barnetrygdsperiodeEøs,
                            barnetsId: barn.id,
                        })}
                        feilmelding={
                            registrerteEøsBarnetrygdsperioder.erSynlig &&
                            skjema.visFeilmeldinger &&
                            registrerteEøsBarnetrygdsperioder.feilmelding
                        }
                    >
                        <TekstBlock block={teksterForPersonType.leggTilKnapp} />
                    </LeggTilKnapp>
                    {barnetrygdsmodalErÅpen && (
                        <BarnetrygdperiodeModal
                            erÅpen={barnetrygdsmodalErÅpen}
                            lukkModal={lukkBarnetrygdsmodal}
                            onLeggTilBarnetrygdsperiode={leggTilBarnetrygdsperiode}
                            barn={barn}
                            personType={personType}
                            erDød={erDød}
                            forklaring={plainTekst(teksterForPersonType.leggTilPeriodeForklaring)}
                        />
                    )}
                </PerioderContainer>
            )}
        </KomponentGruppe>
    );
};
