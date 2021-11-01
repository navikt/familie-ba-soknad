import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { LocaleType, useSprakContext } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import {
    erModellMismatchResponsRessurs,
    modellVersjon,
    modellVersjonHeaderName,
} from '../../shared-utils/modellversjon';
import {
    samboerSpråkIder,
    SamboerSpørsmålId,
    TidligereSamboerSpørsmålId,
} from '../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import {
    OmBarnetSpørsmålsId,
    omBarnetSpørsmålSpråkId,
} from '../components/SøknadsSteg/OmBarnet/spørsmål';
import { useApp } from '../context/AppContext';
import Miljø from '../Miljø';
import {
    Dokumentasjonsbehov,
    IDokumentasjon,
    ISøknadKontraktDokumentasjon,
    ISøknadKontraktVedlegg,
    IVedlegg,
    dokumentasjonsbehovTilSpråkId,
} from '../typer/dokumentasjon';
import { IKvittering } from '../typer/kvittering';
import {
    AlternativtSvarForInput,
    barnDataKeySpørsmål,
    barnDataKeySpørsmålUtvidet,
    ESivilstand,
    IBarnMedISøknad,
    ISamboer,
    ITidligereSamboer,
} from '../typer/person';
import {
    IKontraktNåværendeSamboer,
    IKontraktTidligereSamboer,
    ISøknad,
    ISøknadKontrakt,
    ISøknadKontraktBarn,
    ISøknadsfelt,
    ISøknadSpørsmål,
    SpørsmålId,
    SpørsmålMap as KontraktpørsmålMap,
    Årsak,
} from '../typer/søknad';
import { barnetsNavnValue } from '../utils/barn';
import { erDokumentasjonRelevant } from '../utils/dokumentasjon';
import {
    hentSivilstatusSpråkId,
    hentTekster,
    hentUformaterteTekster,
    landkodeTilSpråk,
    toÅrsakSpråkId,
} from '../utils/språk';
import { jaNeiSvarTilSpråkId, språkIndexListe } from '../utils/spørsmål';
import { erTidligereSamboer, isAlpha3Code } from '../utils/typeguards';
import { formaterFnr } from '../utils/visning';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type SpørsmålMap = Record<string, ISøknadSpørsmål<any>>;

export const useSendInnSkjema = (): {
    sendInnSkjema: () => Promise<[boolean, ISøknadKontrakt]>;
} => {
    const { axiosRequest, søknad, settInnsendingStatus, settSisteModellVersjon } = useApp();
    const { soknadApi } = Miljø();
    const [valgtSpråk] = useSprakContext();
    const intl = useIntl();

    const språktekstIdFraSpørsmålId = (spørsmålId: SpørsmålId): string => {
        for (const språkIndex of språkIndexListe) {
            if (spørsmålId in språkIndex) {
                return språkIndex[spørsmålId];
            }
        }
        return 'ukjent-spørsmål';
    };

    const søknadsfelt = <T extends any>(
        labelTekstId: string,
        value: Record<LocaleType, T>,
        labelMessageValues: object = {}
    ): ISøknadsfelt<T> => {
        return { label: hentTekster(labelTekstId, labelMessageValues), verdi: value };
    };

    const verdiCallbackAlleSpråk = <T extends any>(
        cb: (locale: LocaleType) => T
    ): Record<LocaleType, T> => ({
        [LocaleType.nb]: cb(LocaleType.nb),
        [LocaleType.nn]: cb(LocaleType.nn),
        [LocaleType.en]: cb(LocaleType.en),
    });

    const sammeVerdiAlleSpråk = <T extends any>(verdi: T): Record<LocaleType, T> =>
        verdiCallbackAlleSpråk(() => verdi);

    const sammeVerdiAlleSpråkEllerUkjentSpråktekst = (
        svar: string | AlternativtSvarForInput,
        ukjentTekstid: string
    ) =>
        svar === AlternativtSvarForInput.UKJENT
            ? hentTekster(ukjentTekstid)
            : sammeVerdiAlleSpråk(svar);

    const spørmålISøknadsFormat = (
        spørsmålMap: SpørsmålMap,
        formatMessageValues: object = {}
    ): KontraktpørsmålMap => {
        return Object.fromEntries(
            Object.entries(spørsmålMap)
                .map(
                    (
                        entry: [string, ISøknadSpørsmål<any>]
                    ): [
                        string,
                        { label: Record<LocaleType, string>; verdi: Record<LocaleType, any> }
                    ] => {
                        const verdi = entry[1].svar;
                        let formatertVerdi: Record<LocaleType, string>;

                        if (isAlpha3Code(verdi)) {
                            formatertVerdi = verdiCallbackAlleSpråk(locale =>
                                landkodeTilSpråk(verdi, locale)
                            );
                        } else if (verdi in ESvar) {
                            // Slår opp språktekst i språkteksterUtenomSpørsmål i dokgen
                            formatertVerdi = sammeVerdiAlleSpråk(verdi);
                        } else if (verdi in Årsak) {
                            formatertVerdi = hentTekster(toÅrsakSpråkId(verdi));
                        } else {
                            formatertVerdi = sammeVerdiAlleSpråk(verdi);
                        }

                        return [
                            entry[0],
                            søknadsfelt(
                                språktekstIdFraSpørsmålId(entry[1].id),
                                formatertVerdi,
                                formatMessageValues
                            ),
                        ];
                    }
                )
                .filter(entry => entry[1].verdi[LocaleType.nb])
        );
    };

    const barnISøknadsFormat = (barn: IBarnMedISøknad): ISøknadKontraktBarn => {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const {
            id,
            barnErFyltUt,
            ident,
            navn,
            borMedSøker,
            alder,
            adressebeskyttelse,
            andreForelderNavn,
            andreForelderFnr,
            andreForelderFødselsdato,
            søkerForTidsromSluttdato,
            institusjonOppholdSluttdato,
            nårKomBarnTilNorgeDato,
            oppholdslandSluttdato,
            utvidet,
            ...barnSpørsmål
        } = barn;
        const typetBarnSpørsmål = barnSpørsmål as unknown as SpørsmålMap;
        const { søkerFlyttetFraAndreForelderDato } = utvidet;

        const søknadsfeltBarn: typeof søknadsfelt = (
            labelTekstId,
            value,
            labelMessageValues = {}
        ) =>
            søknadsfelt(labelTekstId, value, {
                ...labelMessageValues,
                navn: barnetsNavnValue(barn, intl),
                barn: barnetsNavnValue(barn, intl),
            });

        return {
            navn: søknadsfeltBarn(
                'pdf.barn.navn.label',
                sammeVerdiAlleSpråk(adressebeskyttelse ? `Barn ${formaterFnr(ident)}` : navn)
            ),
            ident: søknadsfeltBarn(
                'pdf.barn.ident.label',
                ident ? sammeVerdiAlleSpråk(ident) : hentTekster('pdf.barn.ikke-oppgitt')
            ),
            borMedSøker: søknadsfeltBarn(
                'pdf.barn.bormedsoker.label',
                sammeVerdiAlleSpråk(
                    borMedSøker ??
                        typetBarnSpørsmål[barnDataKeySpørsmål.borFastMedSøker].svar === ESvar.JA
                )
            ),
            alder: søknadsfeltBarn(
                'pdf.barn.alder.label',
                alder
                    ? hentTekster('felles.år', { alder })
                    : sammeVerdiAlleSpråk(AlternativtSvarForInput.UKJENT)
            ),
            spørsmål: {
                ...spørmålISøknadsFormat(typetBarnSpørsmål, {
                    navn: barnetsNavnValue(barn, intl),
                    barn: barnetsNavnValue(barn, intl),
                }),
                ...spørmålISøknadsFormat(utvidet, {
                    navn: barnetsNavnValue(barn, intl),
                    barn: barnetsNavnValue(barn, intl),
                }),
                [barnDataKeySpørsmål.søkerForTidsromSluttdato]: søknadsfeltBarn(
                    språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.søkerForTidsromSluttdato),
                    sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                        søkerForTidsromSluttdato.svar,
                        omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.søkerForTidsromSluttdatoVetIkke]
                    )
                ),
                [barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato]: søknadsfeltBarn(
                    språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.søkerFlyttetFraAndreForelderDato),
                    sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                        søkerFlyttetFraAndreForelderDato.svar,
                        'pdf.andreforelder.borsammennaa'
                    )
                ),
                [barnDataKeySpørsmål.andreForelderNavn]: søknadsfeltBarn(
                    språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.andreForelderNavn),
                    sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                        andreForelderNavn.svar,
                        omBarnetSpørsmålSpråkId['andre-forelder-navn-ukjent']
                    )
                ),
                [barnDataKeySpørsmål.andreForelderFnr]: søknadsfeltBarn(
                    språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.andreForelderFnr),
                    sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                        andreForelderFnr.svar,
                        omBarnetSpørsmålSpråkId['andre-forelder-fødsels-/dnummer-ukjent']
                    )
                ),
                [barnDataKeySpørsmål.andreForelderFødselsdato]: søknadsfeltBarn(
                    språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.andreForelderFødselsdato),
                    sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                        andreForelderFødselsdato.svar,
                        omBarnetSpørsmålSpråkId['andre-forelder-fødselsdato-ukjent']
                    )
                ),
                [barnDataKeySpørsmål.institusjonOppholdSluttdato]: søknadsfeltBarn(
                    språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.institusjonOppholdSluttdato),
                    sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                        institusjonOppholdSluttdato.svar,
                        omBarnetSpørsmålSpråkId['institusjon-opphold-ukjent-sluttdato']
                    )
                ),
                [barnDataKeySpørsmål.oppholdslandSluttdato]: søknadsfeltBarn(
                    språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.oppholdslandSluttdato),
                    sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                        oppholdslandSluttdato.svar,
                        omBarnetSpørsmålSpråkId['barn-utenlandsopphold-ukjent-sluttdato']
                    )
                ),
                [barnDataKeySpørsmål.nårKomBarnTilNorgeDato]: søknadsfeltBarn(
                    språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.nårKomBarnetTilNorge),
                    sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                        nårKomBarnTilNorgeDato.svar,
                        omBarnetSpørsmålSpråkId[
                            'ombarnet.sammenhengende-opphold.dato.ikkekommetenda'
                        ]
                    )
                ),
            },
        };
    };

    const dokumentasjonISøknadFormat = (
        dokumentasjon: IDokumentasjon
    ): ISøknadKontraktDokumentasjon => ({
        dokumentasjonsbehov: dokumentasjon.dokumentasjonsbehov,
        harSendtInn: dokumentasjon.harSendtInn,
        opplastedeVedlegg: dokumentasjon.opplastedeVedlegg.map(vedlegg =>
            vedleggISøknadFormat(vedlegg, dokumentasjon.dokumentasjonsbehov)
        ),
        dokumentasjonSpråkTittel:
            dokumentasjon.dokumentasjonsbehov === Dokumentasjonsbehov.BOR_FAST_MED_SØKER
                ? hentTekster('pdf.vedlegg.bekreftelse-barn-bor-med-deg.tittel')
                : hentTekster(dokumentasjonsbehovTilSpråkId(dokumentasjon.dokumentasjonsbehov)),
    });

    const vedleggISøknadFormat = (
        vedlegg: IVedlegg,
        dokumentasjonsbehov: Dokumentasjonsbehov
    ): ISøknadKontraktVedlegg => ({
        navn: vedlegg.navn,
        dokumentId: vedlegg.dokumentId,
        tittel: dokumentasjonsbehov,
    });

    const samboerISøknadKontraktFormat = (
        samboer: ISamboer
    ): ISøknadsfelt<IKontraktNåværendeSamboer> => {
        const { ident, samboerFraDato, navn, fødselsdato } = samboer;
        const erTidligere = erTidligereSamboer(samboer);
        const språktekstIds = {
            navn: språktekstIdFraSpørsmålId(
                erTidligere
                    ? TidligereSamboerSpørsmålId.tidligereSamboerNavn
                    : SamboerSpørsmålId.nåværendeSamboerNavn
            ),
            ident: språktekstIdFraSpørsmålId(
                erTidligere
                    ? TidligereSamboerSpørsmålId.tidligereSamboerFnr
                    : SamboerSpørsmålId.nåværendeSamboerFnr
            ),
            fødselsdato: språktekstIdFraSpørsmålId(
                erTidligere
                    ? TidligereSamboerSpørsmålId.tidligereSamboerFødselsdato
                    : SamboerSpørsmålId.nåværendeSamboerFødselsdato
            ),
            samboerFraDato: språktekstIdFraSpørsmålId(
                erTidligere
                    ? TidligereSamboerSpørsmålId.tidligereSamboerFraDato
                    : SamboerSpørsmålId.nåværendeSamboerFraDato
            ),
        };
        return søknadsfelt(
            'pdf.samboer.label',
            sammeVerdiAlleSpråk({
                navn: søknadsfelt(språktekstIds.navn, sammeVerdiAlleSpråk(navn.svar)),
                ident: søknadsfelt(
                    språktekstIds.ident,
                    sammeVerdiAlleSpråkEllerUkjentSpråktekst(ident.svar, samboerSpråkIder.fnrUkjent)
                ),
                fødselsdato: søknadsfelt(
                    språktekstIds.fødselsdato,
                    sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                        fødselsdato.svar,
                        samboerSpråkIder.fødselsdatoUkjent
                    )
                ),
                samboerFraDato: søknadsfelt(
                    språktekstIds.samboerFraDato,
                    sammeVerdiAlleSpråk(samboerFraDato.svar)
                ),
            })
        );
    };

    const tidligereSamboerISøknadKontraktFormat = (
        samboer: ITidligereSamboer
    ): ISøknadsfelt<IKontraktTidligereSamboer> => {
        const { samboerTilDato, navn } = samboer;
        const { verdi: samboerIKontraktFormat } = samboerISøknadKontraktFormat(samboer);

        return søknadsfelt(
            'pdf.tidligeresamboer.label',
            sammeVerdiAlleSpråk({
                ...samboerIKontraktFormat[LocaleType.nb],
                samboerTilDato: søknadsfelt(
                    språktekstIdFraSpørsmålId(TidligereSamboerSpørsmålId.tidligereSamboerTilDato),
                    sammeVerdiAlleSpråk(samboerTilDato.svar)
                ),
            }),
            { navn: navn.svar }
        );
    };

    const dataISøknadKontraktFormat = (søknad: ISøknad): ISøknadKontrakt => {
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
            adressebeskyttelse,
            nåværendeSamboer,
            ...søkerSpørsmål
        } = søker;
        const { spørsmål: utvidaSpørsmål, tidligereSamboere } = utvidet;
        const { barnInkludertISøknaden } = søknad;
        const typetSøkerSpørsmål: SpørsmålMap = søkerSpørsmål as unknown as SpørsmålMap;
        const typetUtvidaSpørsmål: SpørsmålMap = utvidaSpørsmål as unknown as SpørsmålMap;

        return {
            søknadstype: søknad.søknadstype,
            søker: {
                navn: søknadsfelt('pdf.søker.navn.label', sammeVerdiAlleSpråk(søker.navn)),
                ident: søknadsfelt('pdf.søker.ident.label', sammeVerdiAlleSpråk(søker.ident)),
                sivilstand: søknadsfelt(
                    'pdf.søker.sivilstand.label',
                    sammeVerdiAlleSpråk(søker.sivilstand.type)
                ),
                statsborgerskap: søknadsfelt(
                    'pdf.søker.statsborgerskap.label',
                    verdiCallbackAlleSpråk(locale =>
                        søker.statsborgerskap.map(objekt =>
                            landkodeTilSpråk(objekt.landkode, locale)
                        )
                    )
                ),
                adresse: søknadsfelt(
                    'pdf.søker.adresse.label',
                    sammeVerdiAlleSpråk(søker.adresse ?? {})
                ),
                spørsmål: {
                    ...spørmålISøknadsFormat(typetSøkerSpørsmål),
                    ...spørmålISøknadsFormat(typetUtvidaSpørsmål),
                },
                tidligereSamboere: tidligereSamboere.map(tidligereSamboerISøknadKontraktFormat),
                nåværendeSamboer: nåværendeSamboer
                    ? samboerISøknadKontraktFormat(nåværendeSamboer)
                    : null,
            },
            barn: barnInkludertISøknaden.map(barn => barnISøknadsFormat(barn)),
            spørsmål: {
                erNoenAvBarnaFosterbarn: søknadsfelt(
                    språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn),
                    sammeVerdiAlleSpråk(søknad.erNoenAvBarnaFosterbarn.svar)
                ),
                søktAsylForBarn: søknadsfelt(
                    språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.søktAsylForBarn),
                    sammeVerdiAlleSpråk(søknad.søktAsylForBarn.svar)
                ),
                oppholderBarnSegIInstitusjon: søknadsfelt(
                    språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon),
                    sammeVerdiAlleSpråk(søknad.oppholderBarnSegIInstitusjon.svar)
                ),
                barnOppholdtSegTolvMndSammenhengendeINorge: søknadsfelt(
                    språktekstIdFraSpørsmålId(
                        OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge
                    ),
                    sammeVerdiAlleSpråk(søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar)
                ),
                erBarnAdoptertFraUtland: søknadsfelt(
                    språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland),
                    sammeVerdiAlleSpråk(søknad.erBarnAdoptertFraUtland.svar)
                ),
                mottarBarnetrygdForBarnFraAnnetEøsland: søknadsfelt(
                    språktekstIdFraSpørsmålId(
                        OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland
                    ),
                    sammeVerdiAlleSpråk(søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar)
                ),
                oppholderBarnSegIUtland: søknadsfelt(
                    språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.oppholderBarnSegIUtland),
                    sammeVerdiAlleSpråk(søknad.oppholderBarnSegIUtland.svar)
                ),
                erAvdødPartnerForelder: søknadsfelt(
                    språktekstIdFraSpørsmålId(søknad.erAvdødPartnerForelder.id),
                    sammeVerdiAlleSpråk(søknad.erAvdødPartnerForelder.svar)
                ),
                lestOgForståttBekreftelse: søknadsfelt(
                    'forside.bekreftelsesboks.brødtekst',
                    søknad.lestOgForståttBekreftelse
                        ? hentTekster('forside.bekreftelsesboks.erklæring.spm')
                        : sammeVerdiAlleSpråk(ESvar.NEI)
                ),
            },
            dokumentasjon: søknad.dokumentasjon
                .filter(dok => erDokumentasjonRelevant(dok))
                .map(dok => dokumentasjonISøknadFormat(dok)),
            teksterUtenomSpørsmål: [
                'ombarnet.fosterbarn',
                'ombarnet.institusjon',
                'ombarnet.oppholdutland',
                'ombarnet.sammenhengende-opphold',
                'ombarnet.barnetrygd-eøs',
                'omdeg.annensamboer.spm',
                'pdf.andreforelder.seksjonstittel',
                'pdf.hvilkebarn.seksjonstittel',
                'pdf.hvilkebarn.registrert-på-adresse',
                'pdf.hvilkebarn.ikke-registrert-på-adresse',
                'pdf.ombarnet.seksjonstittel',
                'pdf.omdeg.seksjonstittel',
                'pdf.bosted.seksjonstittel',
                'pdf.ombarna.seksjonstittel',
                'pdf.søker-for-tidsrom.seksjonstittel',
                'pdf.søker.seksjonstittel',
                'pdf.vedlegg.seksjonstittel',
                'pdf.vedlegg.lastet-opp-antall',
                'pdf.vedlegg.nummerering',
                'dokumentasjon.har-sendt-inn.spm',
                'dinlivssituasjon.sidetittel',
                'pdf.dinlivssituasjon.tidligeresamboer.seksjonstittel',
                ...Object.values(ESivilstand).map(hentSivilstatusSpråkId),
                ...Object.values(ESvar).map(jaNeiSvarTilSpråkId),
            ].reduce(
                (map, tekstId) => ({ ...map, [tekstId]: hentUformaterteTekster(tekstId) }),
                {}
            ),
            originalSpråk: valgtSpråk,
        };
    };

    const sendInnSkjema = async (): Promise<[boolean, ISøknadKontrakt]> => {
        settInnsendingStatus({ status: RessursStatus.HENTER });
        const formatert = dataISøknadKontraktFormat(søknad);

        const res = await axiosRequest<IKvittering, ISøknadKontrakt>({
            url: `${soknadApi}/soknad/v4`,
            method: 'POST',
            withCredentials: true,
            data: formatert,
            headers: {
                [modellVersjonHeaderName]: modellVersjon,
            },
            rejectCallback: res => {
                const responseData = res.response?.data;
                if (responseData && erModellMismatchResponsRessurs(responseData)) {
                    settSisteModellVersjon(responseData.data.modellVersjon);
                }
            },
        });
        settInnsendingStatus(res);

        return [res.status === RessursStatus.SUKSESS, formatert];
    };

    return {
        sendInnSkjema,
    };
};
