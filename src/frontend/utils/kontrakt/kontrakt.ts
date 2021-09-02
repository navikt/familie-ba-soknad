import { IntlShape } from 'react-intl/src/types';

import { ESvar } from '@navikt/familie-form-elements';

import * as bokmålSpråktekster from '../../assets/lang/nb.json';
import { SpørsmålMap } from '../../components/SøknadsSteg/Dokumentasjon/useSendInnSkjema';
import { OmBarnaDineSpørsmålId } from '../../components/SøknadsSteg/OmBarnaDine/spørsmål';
import {
    SamboerSpørsmålId,
    TidligereSamboerSpørsmålId,
} from '../../components/SøknadsSteg/Utvidet-DinLivssituasjon/spørsmål';
import {
    Dokumentasjonsbehov,
    IDokumentasjon,
    ISøknadKontraktDokumentasjon,
    ISøknadKontraktVedlegg,
    IVedlegg,
} from '../../typer/dokumentasjon';
import {
    AlternativtSvarForInput,
    barnDataKeySpørsmål,
    IBarnMedISøknad,
    ISamboer,
    ITidligereSamboer,
} from '../../typer/person';
import {
    ESøknadstype,
    IKontraktNåværendeSamboer,
    IKontraktTidligereSamboer,
    ISøknad,
    ISøknadKontrakt,
    ISøknadKontraktBarn,
    ISøknadsfelt,
    ISøknadSpørsmål,
    SpørsmålId,
} from '../../typer/søknad';
import { erDokumentasjonRelevant } from '../dokumentasjon';
import { isAlpha3Code } from '../hjelpefunksjoner';
import { erTidligereSamboer } from '../person';
import { språkIndexListe } from '../spørsmål';
import { formaterFnr, landkodeTilSpråk } from '../visning';

/* eslint-disable @typescript-eslint/no-explicit-any */

const søknadsfelt = (label, value) => {
    return { label: label, verdi: value };
};

const språktekstFraSpørsmålId = (spørsmålId: SpørsmålId, intl: IntlShape): string => {
    for (const språkIndex of språkIndexListe) {
        if (spørsmålId in språkIndex) {
            return intl.formatMessage({ id: språkIndex[spørsmålId] });
        }
    }
    return 'ukjent-spørsmål';
};

const spørmålISøknadsFormat = (spørsmålMap: SpørsmålMap, intl: IntlShape) => {
    return Object.fromEntries(
        Object.entries(spørsmålMap)
            .map((entry: [string, ISøknadSpørsmål<any>]): [
                string,
                { label: string; verdi: any }
            ] => {
                const verdi = entry[1].svar;
                let formatertVerdi: string;

                if (isAlpha3Code(verdi)) {
                    formatertVerdi = landkodeTilSpråk(verdi, 'nb');
                } else if (verdi === ESvar.VET_IKKE) {
                    formatertVerdi = ESvar.VET_IKKE.replace('_', ' ');
                } else {
                    formatertVerdi = verdi;
                }

                const spørsmålId = entry[1].id;
                return [
                    entry[0],
                    søknadsfelt(språktekstFraSpørsmålId(spørsmålId, intl), formatertVerdi),
                ];
            })
            .filter(entry => entry[1].verdi)
    );
};

const tidligereSamboerISøknadKontraktFormat = (
    samboer: ITidligereSamboer,
    intl: IntlShape
): ISøknadsfelt<IKontraktTidligereSamboer> => {
    const { samboerTilDato, navn } = samboer;
    const { verdi: samboerIKontraktFormat } = samboerISøknadKontraktFormat(samboer, intl);

    return søknadsfelt(`Tidligere samboer: ${navn.svar}`, {
        ...samboerIKontraktFormat,
        samboerTilDato: søknadsfelt(
            språktekstFraSpørsmålId(TidligereSamboerSpørsmålId.tidligereSamboerTilDato, intl),
            samboerTilDato.svar
        ),
    });
};

const samboerISøknadKontraktFormat = (
    samboer: ISamboer,
    intl: IntlShape
): ISøknadsfelt<IKontraktNåværendeSamboer> => {
    const { ident, samboerFraDato, navn, fødselsdato } = samboer;
    const erTidligere = erTidligereSamboer(samboer);
    const språktekster = {
        navn: språktekstFraSpørsmålId(
            erTidligere
                ? TidligereSamboerSpørsmålId.tidligereSamboerNavn
                : SamboerSpørsmålId.nåværendeSamboerNavn,
            intl
        ),
        ident: språktekstFraSpørsmålId(
            erTidligere
                ? TidligereSamboerSpørsmålId.tidligereSamboerFnr
                : SamboerSpørsmålId.nåværendeSamboerFnr,
            intl
        ),
        fødselsdato: språktekstFraSpørsmålId(
            erTidligere
                ? TidligereSamboerSpørsmålId.tidligereSamboerFødselsdato
                : SamboerSpørsmålId.nåværendeSamboerFødselsdato,
            intl
        ),
        samboerFraDato: språktekstFraSpørsmålId(
            erTidligere
                ? TidligereSamboerSpørsmålId.tidligereSamboerFraDato
                : SamboerSpørsmålId.nåværendeSamboerFraDato,
            intl
        ),
    };
    return søknadsfelt('Samboer', {
        navn: søknadsfelt(språktekster.navn, navn.svar),
        ident: søknadsfelt(språktekster.ident, ident.svar),
        fødselsdato: søknadsfelt(språktekster.fødselsdato, fødselsdato.svar),
        samboerFraDato: søknadsfelt(språktekster.samboerFraDato, samboerFraDato.svar),
    });
};

const barnISøknadsFormat = (barn: IBarnMedISøknad, intl: IntlShape): ISøknadKontraktBarn => {
    const { ident, navn, borMedSøker, alder, adressebeskyttelse, utvidet, ...barnSpørsmål } = barn;
    const typetBarnSpørsmål = (barnSpørsmål as unknown) as SpørsmålMap;

    return {
        navn: søknadsfelt('Navn', adressebeskyttelse ? `Barn ${formaterFnr(ident)}` : navn),
        ident: søknadsfelt('Ident', ident ?? 'Ikke oppgitt'),
        borMedSøker: søknadsfelt(
            'Bor med søker',
            borMedSøker ?? typetBarnSpørsmål[barnDataKeySpørsmål.borFastMedSøker].svar === ESvar.JA
        ),
        alder: søknadsfelt('Alder', alder ?? AlternativtSvarForInput.UKJENT),
        spørsmål: spørmålISøknadsFormat(typetBarnSpørsmål, intl),
        utvidet: utvidet ? spørmålISøknadsFormat(utvidet, intl) : undefined,
    };
};

const vedleggISøknadFormat = (
    vedlegg: IVedlegg,
    dokumentasjonsbehov: Dokumentasjonsbehov
): ISøknadKontraktVedlegg => ({
    navn: vedlegg.navn,
    dokumentId: vedlegg.dokumentId,
    tittel: dokumentasjonsbehov,
});

const dokumentasjonISøknadFormat = (
    dokumentasjon: IDokumentasjon
): ISøknadKontraktDokumentasjon => ({
    dokumentasjonsbehov: dokumentasjon.dokumentasjonsbehov,
    harSendtInn: dokumentasjon.harSendtInn,
    opplastedeVedlegg: dokumentasjon.opplastedeVedlegg.map(vedlegg =>
        vedleggISøknadFormat(vedlegg, dokumentasjon.dokumentasjonsbehov)
    ),
});

export const dataISøknadKontraktFormat = (søknad: ISøknad, intl: IntlShape): ISøknadKontrakt => {
    const { søker } = søknad;
    // Raskeste måte å få tak i alle spørsmål minus de andre feltene på søker
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
        navn,
        ident,
        sivilstand,
        statsborgerskap,
        adresse,
        barn,
        utvidet,
        ...søkerSpørsmål
    } = søker;
    const { spørsmål: utvidaSpørsmål, nåværendeSamboer, tidligereSamboere } = utvidet;
    const { barnInkludertISøknaden } = søknad;
    const typetSøkerSpørsmål: SpørsmålMap = (søkerSpørsmål as unknown) as SpørsmålMap;
    const typetUtvidaSpørsmål: SpørsmålMap = (utvidaSpørsmål as unknown) as SpørsmålMap;

    return {
        søknadstype: søknad.søknadstype,
        søker: {
            navn: søknadsfelt('Navn', søker.navn),
            ident: søknadsfelt('Ident', søknad.søker.ident),
            sivilstand: søknadsfelt('Sivilstand', søker.sivilstand.type),
            statsborgerskap: søknadsfelt(
                'Statsborgerskap',
                søker.statsborgerskap.map(objekt => landkodeTilSpråk(objekt.landkode, 'nb'))
            ),
            adresse: søknadsfelt('Adresse', søker.adresse),
            spørsmål: spørmålISøknadsFormat(typetSøkerSpørsmål, intl),
            utvidet:
                søknad.søknadstype === ESøknadstype.UTVIDET
                    ? søknadsfelt('Utvidet', {
                          spørsmål: spørmålISøknadsFormat(typetUtvidaSpørsmål, intl),
                          tidligereSamboere: tidligereSamboere.map(s =>
                              tidligereSamboerISøknadKontraktFormat(s, intl)
                          ),
                          nåværendeSamboer: nåværendeSamboer
                              ? samboerISøknadKontraktFormat(nåværendeSamboer, intl)
                              : null,
                      })
                    : undefined,
        },
        barn: barnInkludertISøknaden.map(barn => barnISøknadsFormat(barn, intl)),
        spørsmål: {
            erNoenAvBarnaFosterbarn: søknadsfelt(
                språktekstFraSpørsmålId(OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn, intl),
                søknad.erNoenAvBarnaFosterbarn.svar
            ),
            søktAsylForBarn: søknadsfelt(
                språktekstFraSpørsmålId(OmBarnaDineSpørsmålId.søktAsylForBarn, intl),
                søknad.søktAsylForBarn.svar
            ),
            oppholderBarnSegIInstitusjon: søknadsfelt(
                språktekstFraSpørsmålId(OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon, intl),
                søknad.oppholderBarnSegIInstitusjon.svar
            ),
            barnOppholdtSegTolvMndSammenhengendeINorge: søknadsfelt(
                språktekstFraSpørsmålId(
                    OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge,
                    intl
                ),
                søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar
            ),
            erBarnAdoptertFraUtland: søknadsfelt(
                språktekstFraSpørsmålId(OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland, intl),
                søknad.erBarnAdoptertFraUtland.svar
            ),
            mottarBarnetrygdForBarnFraAnnetEøsland: søknadsfelt(
                språktekstFraSpørsmålId(
                    OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland,
                    intl
                ),
                søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar
            ),
            oppholderBarnSegIUtland: søknadsfelt(
                språktekstFraSpørsmålId(OmBarnaDineSpørsmålId.oppholderBarnSegIUtland, intl),
                søknad.oppholderBarnSegIUtland.svar
            ),
            lestOgForståttBekreftelse: søknadsfelt(
                intl.formatMessage({ id: 'forside.bekreftelsesboks.brødtekst' }),
                søknad.lestOgForståttBekreftelse
                    ? intl.formatMessage({ id: 'forside.bekreftelsesboks.erklæring.spm' })
                    : ESvar.NEI
            ),
            oppfølgingsspørsmåltekster: {
                label:
                    'Tekster som ellers trengs til pdf-gen, typ "Du har opplyst at {navn} oppholder seg i institusjon"',
                verdi: {
                    ...Object.fromEntries(
                        [
                            'ombarnet.fosterbarn',
                            'ombarnet.institusjon',
                            'ombarnet.oppholdutland',
                            'ombarnet.sammenhengende-opphold',
                            'ombarnet.barnetrygd-eøs',
                        ].map(tekstId => [tekstId, bokmålSpråktekster[tekstId]])
                    ),
                },
            },
        },
        dokumentasjon: søknad.dokumentasjon
            .filter(dok => erDokumentasjonRelevant(dok))
            .map(dok => dokumentasjonISøknadFormat(dok)),
    };
};
