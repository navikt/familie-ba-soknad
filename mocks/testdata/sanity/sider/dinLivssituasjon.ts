import { IDinLivssituasjonTekstinnhold } from '../../../../src/frontend/components/SøknadsSteg/DinLivssituasjon/innholdTyper';
import { lagLocaleRecordString, lagLocaleRecordBlock, lagSanitySpørsmålDokument } from '../lagSanityObjekter';

export const dinLivssituasjonTekstinnhold: IDinLivssituasjonTekstinnhold = {
    dinLivssituasjonTittel: lagLocaleRecordBlock(),
    dinLivssituasjonGuide: lagLocaleRecordBlock(),
    hvorforSoekerUtvidet: lagSanitySpørsmålDokument(),
    separertEnkeSkilt: lagSanitySpørsmålDokument(),
    separertEnkeSkiltUtland: lagSanitySpørsmålDokument(),
    separertEnkeSkiltDato: lagSanitySpørsmålDokument(),
    harSamboerNaa: lagSanitySpørsmålDokument(),
    harSamboerNaaGift: lagSanitySpørsmålDokument(),
    erAsylsoeker: lagSanitySpørsmålDokument(),
    arbeidUtenforNorge: lagSanitySpørsmålDokument(),
    pensjonUtland: lagSanitySpørsmålDokument(),
    samboersNavn: lagSanitySpørsmålDokument(),
    hattAnnenSamboerForSoektPeriode: lagSanitySpørsmålDokument(),
    foedselsEllerDNummer: lagSanitySpørsmålDokument(),

    /* Årsak valgalternativ */
    valgalternativAarsakPlaceholder: lagLocaleRecordString(),
    valgalternativSeparert: lagLocaleRecordString(),
    valgalternativSkilt: lagLocaleRecordString(),
    valgalternativBruddSamboer: lagLocaleRecordString(),
    valgalternativBoddAlene: lagLocaleRecordString(),
    valgalternativEnkeEnkemann: lagLocaleRecordString(),
    valgalternativFengselVaretekt: lagLocaleRecordString(),
    valgalternativBruddGift: lagLocaleRecordString(),
    valgalternativForsvunnet: lagLocaleRecordString(),
    valgalternativForvaring: lagLocaleRecordString(),
    valgalternativPsykiskHelsevern: lagLocaleRecordString(),
};
