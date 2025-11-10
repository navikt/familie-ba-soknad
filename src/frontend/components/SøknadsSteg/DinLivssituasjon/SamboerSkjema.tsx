import { ESvar } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';

import { ISODateString } from '../../../../common/typer/common';
import { useAppContext } from '../../../context/AppContext';
import { DatoMedUkjent } from '../../../typer/common';
import { ITidligereSamoboereTekstinnhold } from '../../../typer/sanity/modaler/tidligereSamboere';
import { IDinLivssituasjonFeltTyper, ITidligereSamboerFeltTyper } from '../../../typer/skjema';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import { SkjemaCheckboxForSanity } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckboxForSanity';
import { SkjemaFeltInputForSanity } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInputForSanity';

const SamboerSkjema: React.FC<{
    skjema: ISkjema<IDinLivssituasjonFeltTyper | ITidligereSamboerFeltTyper, string>;
    samboerFelter: {
        navn: Felt<string>;
        fnr: Felt<string>;
        fnrUkjent: Felt<ESvar>;
        fødselsdato: Felt<DatoMedUkjent>;
        fødselsdatoUkjent: Felt<ESvar>;
        samboerFraDato: Felt<ISODateString>;
        samboerTilDato?: Felt<ISODateString>;
    };
    erIModal?: boolean;
}> = ({ skjema, samboerFelter, erIModal = false }) => {
    const { tekster } = useAppContext();

    const teksterForModal: ITidligereSamoboereTekstinnhold = tekster().FELLES.modaler.tidligereSamboere.søker;

    return (
        <>
            <SkjemaFeltInputForSanity
                felt={samboerFelter.navn}
                visFeilmeldinger={skjema.visFeilmeldinger}
                label={<TekstBlock block={teksterForModal.samboerNavn.sporsmal} />}
            />
            <div>
                <SkjemaFeltInputForSanity
                    felt={samboerFelter.fnr}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    label={<TekstBlock block={teksterForModal.foedselsnummerEllerDNummer.sporsmal} />}
                    disabled={samboerFelter.fnrUkjent.verdi === ESvar.JA}
                />
                <SkjemaCheckboxForSanity
                    label={<TekstBlock block={teksterForModal.foedselsnummerEllerDNummer.checkboxLabel} />}
                    felt={samboerFelter.fnrUkjent}
                />
            </div>
            {samboerFelter.fødselsdato.erSynlig && (
                <div>
                    <Datovelger
                        skjema={skjema}
                        felt={samboerFelter.fødselsdato}
                        label={<TekstBlock block={teksterForModal.foedselsdato.sporsmal} />}
                        avgrensMaxDato={dagensDato()}
                        disabled={samboerFelter.fødselsdatoUkjent.verdi === ESvar.JA}
                        strategy={erIModal ? 'absolute' : 'fixed'}
                    />
                    <SkjemaCheckboxForSanity
                        label={<TekstBlock block={teksterForModal.foedselsdato.checkboxLabel} />}
                        felt={samboerFelter.fødselsdatoUkjent}
                    />
                </div>
            )}
            <Datovelger
                skjema={skjema}
                felt={samboerFelter.samboerFraDato}
                label={<TekstBlock block={teksterForModal.startdato.sporsmal} />}
                avgrensMaxDato={samboerFelter.samboerTilDato ? gårsdagensDato() : dagensDato()}
                strategy={erIModal ? 'absolute' : 'fixed'}
            />
            {samboerFelter.samboerTilDato && (
                <Datovelger
                    skjema={skjema}
                    felt={samboerFelter.samboerTilDato}
                    label={<TekstBlock block={teksterForModal.sluttdato.sporsmal} />}
                    tilhørendeFraOgMedFelt={samboerFelter.samboerFraDato}
                    avgrensDatoFremITid={true}
                    strategy={erIModal ? 'absolute' : 'fixed'}
                />
            )}
        </>
    );
};

export default SamboerSkjema;
