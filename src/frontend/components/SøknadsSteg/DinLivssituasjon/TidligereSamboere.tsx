import JaNeiSpm from '@components/Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '@components/Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '@components/Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '@components/Felleskomponenter/PerioderContainer';
import TekstBlock from '@components/Felleskomponenter/Sanity/TekstBlock';
import useModal from '@components/Felleskomponenter/SkjemaModal/useModal';
import { useAppContext } from '@context/AppContext';
import { ESvar } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';
import type { ITidligereSamboer } from '@typer/person';
import { PersonType } from '@typer/personType';
import type { ITidligereSamoboereTekstinnhold } from '@typer/sanity/modaler/tidligereSamboere';
import type { IDinLivssituasjonFeltTyper } from '@typer/skjema';
import { genererPeriodeId } from '@utils/perioder';
import { uppercaseFørsteBokstav } from '@utils/visning';
import type { FC } from 'react';

import type { IDinLivssituasjonTekstinnhold } from './innholdTyper';
import LeggTilSamboerModal from './LeggTilSamboerModal';
import SamboerOpplysninger from './SamboerOpplysninger';
import { DinLivssituasjonSpørsmålId } from './spørsmål';

interface Props {
    skjema: ISkjema<IDinLivssituasjonFeltTyper, string>;
    leggTilTidligereSamboer: (samboer: ITidligereSamboer) => void;
    fjernTidligereSamboer: (samboer: ITidligereSamboer) => void;
    hattAnnenSamboerForSøktPeriodeFelt: Felt<ESvar | null>;
    tidligereSamboere: Felt<ITidligereSamboer[]>;
}

const TidligereSamboere: FC<Props> = ({
    skjema,
    leggTilTidligereSamboer,
    fjernTidligereSamboer,
    hattAnnenSamboerForSøktPeriodeFelt,
    tidligereSamboere,
}) => {
    const {
        lukkModal: lukkLeggTilSamboerModal,
        åpneModal: åpneLeggTilSamboerModal,
        erÅpen: erLeggTilSamboerModalÅpen,
    } = useModal();
    const { tekster, plainTekst } = useAppContext();

    const teksterForModal: ITidligereSamoboereTekstinnhold = tekster().FELLES.modaler.tidligereSamboere.søker;
    const { flerePerioder, leggTilKnapp, leggTilPeriodeForklaring } = teksterForModal;

    const teksterForDinLivssituasjon: IDinLivssituasjonTekstinnhold = tekster().DIN_LIVSSITUASJON;
    const { hattAnnenSamboerForSoektPeriode } = teksterForDinLivssituasjon;

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    return (
        <KomponentGruppe>
            <JaNeiSpm
                skjema={skjema}
                felt={hattAnnenSamboerForSøktPeriodeFelt}
                spørsmålDokument={hattAnnenSamboerForSoektPeriode}
            />
            {hattAnnenSamboerForSøktPeriodeFelt.verdi === ESvar.JA && (
                <PerioderContainer
                    tittel={uppercaseFørsteBokstav(plainTekst(frittståendeOrdTekster.tidligereSamboere))}
                >
                    {tidligereSamboere.verdi.map((samboer: ITidligereSamboer, index: number) => (
                        <SamboerOpplysninger
                            key={index}
                            samboer={samboer}
                            fjernTidligereSamboer={fjernTidligereSamboer}
                        />
                    ))}
                    <LeggTilKnapp
                        leggTilFlereTekst={tidligereSamboere.verdi.length > 0 && plainTekst(flerePerioder)}
                        onClick={åpneLeggTilSamboerModal}
                        id={genererPeriodeId({
                            personType: PersonType.Søker,
                            spørsmålsId: DinLivssituasjonSpørsmålId.hattAnnenSamboerForSøktPeriode,
                        })}
                        feilmelding={
                            tidligereSamboere.erSynlig && skjema.visFeilmeldinger && tidligereSamboere.feilmelding
                        }
                    >
                        <TekstBlock block={leggTilKnapp} />
                    </LeggTilKnapp>
                    {erLeggTilSamboerModalÅpen && (
                        <LeggTilSamboerModal
                            leggTilTidligereSamboer={leggTilTidligereSamboer}
                            lukkModal={lukkLeggTilSamboerModal}
                            erÅpen={erLeggTilSamboerModalÅpen}
                            forklaring={plainTekst(leggTilPeriodeForklaring)}
                        />
                    )}
                </PerioderContainer>
            )}
        </KomponentGruppe>
    );
};
export default TidligereSamboere;
