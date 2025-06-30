import { IUtenlandsoppholdTekstinnhold } from '../../../../../src/frontend/typer/sanity/modaler/utenlandsopphold';
import {
    lagLocaleRecordString,
    lagLocaleRecordBlock,
    lagSanitySpørsmålDokument,
} from '../../lagSanityObjekter';

export const utenlandsoppholdTekstinnhold: IUtenlandsoppholdTekstinnhold = {
    tittel: lagLocaleRecordBlock(),
    flyttetTilNorgeDato: lagSanitySpørsmålDokument(),
    sluttdatoFortid: lagSanitySpørsmålDokument(),
    leggTilPeriodeForklaring: lagLocaleRecordString(),
    flerePerioder: lagLocaleRecordBlock(),
    leggTilKnapp: lagLocaleRecordBlock(),
    leggTilFeilmelding: lagLocaleRecordBlock(),
    valgalternativPermanentIUtland: lagLocaleRecordString(),
    valgalternativPermanentINorge: lagLocaleRecordString(),
    valgalternativOppholdUtenforNorgeTidligere: lagLocaleRecordString(),
    valgalternativOppholdUtenforNorgeNaa: lagLocaleRecordString(),
    valgalternativPlaceholder: lagLocaleRecordString(),
    landFlyttetTil: lagSanitySpørsmålDokument(),
    landFlyttetFra: lagSanitySpørsmålDokument(),
    periodeBeskrivelse: lagSanitySpørsmålDokument(),
    tidligereOpphold: lagSanitySpørsmålDokument(),
    fjernKnapp: lagLocaleRecordBlock(),
    naavaerendeOpphold: lagSanitySpørsmålDokument(),
    flyttetFraNorgeDato: lagSanitySpørsmålDokument(),
    startdato: lagSanitySpørsmålDokument(),
    sluttdatoFremtid: lagSanitySpørsmålDokument(),
    oppsummeringstittel: lagLocaleRecordBlock(),
    adresseFortid: lagSanitySpørsmålDokument(),
    adresseNaatid: lagSanitySpørsmålDokument(),
};
