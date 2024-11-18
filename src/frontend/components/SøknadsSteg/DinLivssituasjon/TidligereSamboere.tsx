import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { ITidligereSamboer } from '../../../typer/person';
import { PersonType } from '../../../typer/personType';
import { ITidligereSamoboereTekstinnhold } from '../../../typer/sanity/modaler/tidligereSamboere';
import { IDinLivssituasjonFeltTyper } from '../../../typer/skjema';
import { genererPeriodeId } from '../../../utils/perioder';
import { uppercaseFørsteBokstav } from '../../../utils/visning';
import JaNeiSpmForSanity from '../../Felleskomponenter/JaNeiSpm/JaNeiSpmForSanity';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '../../Felleskomponenter/PerioderContainer';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';

import { IDinLivssituasjonTekstinnhold } from './innholdTyper';
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

const TidligereSamboere: React.FC<Props> = ({
    skjema,
    leggTilTidligereSamboer,
    fjernTidligereSamboer,
    hattAnnenSamboerForSøktPeriodeFelt,
    tidligereSamboere,
}) => {
    const { toggles } = useFeatureToggles();
    const {
        lukkModal: lukkLeggTilSamboerModal,
        åpneModal: åpneLeggTilSamboerModal,
        erÅpen: erLeggTilSamboerModalÅpen,
    } = useModal();
    const { tekster, plainTekst } = useApp();

    const teksterForModal: ITidligereSamoboereTekstinnhold =
        tekster().FELLES.modaler.tidligereSamboere.søker;
    const { flerePerioder, leggTilPeriodeForklaring } = teksterForModal;

    const teksterForDinLivssituasjon: IDinLivssituasjonTekstinnhold = tekster().DIN_LIVSSITUASJON;
    const { hattAnnenSamboerForSoektPeriode } = teksterForDinLivssituasjon;

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    return (
        <KomponentGruppe>
            <JaNeiSpmForSanity
                skjema={skjema}
                felt={hattAnnenSamboerForSøktPeriodeFelt}
                spørsmålDokument={hattAnnenSamboerForSoektPeriode}
            />
            {hattAnnenSamboerForSøktPeriodeFelt.verdi === ESvar.JA && (
                <PerioderContainer
                    tittel={uppercaseFørsteBokstav(
                        plainTekst(frittståendeOrdTekster.tidligereSamboere)
                    )}
                >
                    {tidligereSamboere.verdi.map((samboer: ITidligereSamboer, index: number) => (
                        <SamboerOpplysninger
                            key={index}
                            samboer={samboer}
                            fjernTidligereSamboer={fjernTidligereSamboer}
                        />
                    ))}
                    <LeggTilKnapp
                        språkTekst="omdeg.leggtilfleresamboere.leggtil"
                        leggTilFlereTekst={
                            toggles.NYE_MODAL_TEKSTER &&
                            tidligereSamboere.verdi.length > 0 &&
                            plainTekst(flerePerioder)
                        }
                        onClick={åpneLeggTilSamboerModal}
                        id={genererPeriodeId({
                            personType: PersonType.Søker,
                            spørsmålsId: DinLivssituasjonSpørsmålId.hattAnnenSamboerForSøktPeriode,
                        })}
                        feilmelding={
                            tidligereSamboere.erSynlig &&
                            skjema.visFeilmeldinger &&
                            tidligereSamboere.feilmelding
                        }
                    />
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
