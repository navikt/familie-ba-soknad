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
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '../../Felleskomponenter/PerioderContainer';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

import LeggTilSamboerModal from './LeggTilSamboerModal';
import SamboerOpplysninger from './SamboerOpplysninger';
import { DinLivssituasjonSpørsmålId, dinLivssituasjonSpørsmålSpråkId } from './spørsmål';

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

    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={hattAnnenSamboerForSøktPeriodeFelt}
                spørsmålTekstId={
                    dinLivssituasjonSpørsmålSpråkId[
                        DinLivssituasjonSpørsmålId.hattAnnenSamboerForSøktPeriode
                    ]
                }
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
                            tidligereSamboere.feilmelding &&
                            skjema.visFeilmeldinger && (
                                <SpråkTekst id="omdeg.tidligereSamboer.feilmelding" />
                            )
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
        </>
    );
};
export default TidligereSamboere;
