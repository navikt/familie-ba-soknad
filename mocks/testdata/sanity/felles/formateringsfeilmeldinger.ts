import { IFormateringsfeilmeldingerTekstinnhold } from '../../../../src/frontend/typer/sanity/tekstInnhold';
import { lagLocaleRecordString } from '../lagSanityObjekter';

export const formateringsfeilmeldingerTekstinnhold: IFormateringsfeilmeldingerTekstinnhold = {
    ugyldigIDnummer: lagLocaleRecordString(),
    ugyldigFoedselsnummer: lagLocaleRecordString(),
    ugyldigRelasjon: lagLocaleRecordString(),
    ugyldigPostnummer: lagLocaleRecordString(),
    ugyldigDato: lagLocaleRecordString(),
    datoKanIkkeVaereFremITid: lagLocaleRecordString(),
    datoKanIkkeVaereDagensDatoEllerFremITid: lagLocaleRecordString(),
    periodeAvsluttesForTidlig: lagLocaleRecordString(),
    datoKanIkkeVaereTilbakeITid: lagLocaleRecordString(),
    datoKanIkkeVaere12MndTilbake: lagLocaleRecordString(),
    ugyldigManed: lagLocaleRecordString(),
    datoErForForsteGyldigeTidspunkt: lagLocaleRecordString(),
    datoErEtterSisteGyldigeTidspunkt: lagLocaleRecordString(),
    datoKanIkkeVareIFortid: lagLocaleRecordString(),
    datoKanIkkeVareIFremtid: lagLocaleRecordString(),
};
