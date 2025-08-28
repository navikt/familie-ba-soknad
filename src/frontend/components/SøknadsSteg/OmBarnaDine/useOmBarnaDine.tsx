import { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { type ISkjema, useSkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { useEøsContext } from '../../../context/EøsContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESivilstand } from '../../../typer/kontrakt/generelle';
import { IOmBarnaDineFeltTyper } from '../../../typer/skjema';
import { Årsak } from '../../../typer/utvidet';
import { nullstilteEøsFelterForSøker } from '../../../utils/søker';

import { OmBarnaDineSpørsmålId } from './spørsmål';
import useBarnCheckboxFelt from './useBarnCheckboxFelt';
import { avdødPartnerForelderSpørsmålDokument, genererOppdaterteBarn } from './utils';

export const useOmBarnaDine = (): {
    skjema: ISkjema<IOmBarnaDineFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    validerAlleSynligeFelter: () => void;
} => {
    const { søknad, settSøknad, tekster } = useAppContext();
    const { skalTriggeEøsForBarn, barnSomTriggerEøs, settBarnSomTriggerEøs, erEøsLand } =
        useEøsContext();

    const skalNullstilleSvalbardfelter =
        søknad.søker.borPåSvalbard.svar !== ESvar.JA &&
        (søknad.harNoenAvBarnaBoddPåSvalbard.svar ||
            søknad.barnInkludertISøknaden.find(
                barn => barn[barnDataKeySpørsmål.harBoddPåSvalbard].svar === ESvar.JA
            ));

    const teksterForSteg = tekster().OM_BARNA;

    const erNoenAvBarnaFosterbarn = useJaNeiSpmFelt({
        søknadsfelt: søknad.erNoenAvBarnaFosterbarn,
        feilmelding: teksterForSteg.fosterbarn.feilmelding,
        feilmeldingSpråkId: 'ombarna.fosterbarn.feilmelding',
    });

    const hvemErFosterbarn = useBarnCheckboxFelt({
        datafeltNavn: barnDataKeySpørsmål.erFosterbarn,
        feilmelding: teksterForSteg.hvemFosterbarn.feilmelding,
        feilmeldingSpråkId: 'ombarna.fosterbarn.hvem.feilmelding',
        avhengighet: erNoenAvBarnaFosterbarn,
    });

    const oppholderBarnSegIInstitusjon = useJaNeiSpmFelt({
        søknadsfelt: søknad.oppholderBarnSegIInstitusjon,
        feilmelding: teksterForSteg.institusjon.feilmelding,
        feilmeldingSpråkId: 'ombarna.institusjon.feilmelding',
    });

    const hvemOppholderSegIInstitusjon = useBarnCheckboxFelt({
        datafeltNavn: barnDataKeySpørsmål.oppholderSegIInstitusjon,
        feilmelding: teksterForSteg.hvemInstitusjon.feilmelding,
        feilmeldingSpråkId: 'ombarna.institusjon.hvem.feilmelding',
        avhengighet: oppholderBarnSegIInstitusjon,
    });

    const erBarnAdoptertFraUtland = useJaNeiSpmFelt({
        søknadsfelt: søknad.erBarnAdoptertFraUtland,
        feilmelding: teksterForSteg.adoptertFraUtlandet.feilmelding,
        feilmeldingSpråkId: 'ombarna.adoptert.feilmelding',
    });

    const hvemErAdoptertFraUtland = useBarnCheckboxFelt({
        datafeltNavn: barnDataKeySpørsmål.erAdoptertFraUtland,
        feilmelding: teksterForSteg.hvemAdoptertFraUtlandet.feilmelding,
        feilmeldingSpråkId: 'ombarna.adoptert.hvem.feilmelding',
        avhengighet: erBarnAdoptertFraUtland,
    });

    const søktAsylForBarn = useJaNeiSpmFelt({
        søknadsfelt: søknad.søktAsylForBarn,
        feilmelding: teksterForSteg.asyl.feilmelding,
        feilmeldingSpråkId: 'ombarna.asyl.feilmelding',
    });

    const hvemErSøktAsylFor = useBarnCheckboxFelt({
        datafeltNavn: barnDataKeySpørsmål.erAsylsøker,
        feilmelding: teksterForSteg.hvemAsyl.feilmelding,
        feilmeldingSpråkId: 'ombarna.asyl.hvem.feilmelding',
        avhengighet: søktAsylForBarn,
    });

    const barnOppholdtSegTolvMndSammenhengendeINorge = useJaNeiSpmFelt({
        søknadsfelt: søknad.barnOppholdtSegTolvMndSammenhengendeINorge,
        feilmelding: teksterForSteg.sammenhengendeOppholdINorge.feilmelding,
        feilmeldingSpråkId: 'ombarna.oppholdtsammenhengende.feilmelding',
    });

    const hvemTolvMndSammenhengendeINorge = useBarnCheckboxFelt({
        datafeltNavn: barnDataKeySpørsmål.boddMindreEnn12MndINorge,
        feilmelding: teksterForSteg.hvemOppholdUtenforNorge.feilmelding,
        feilmeldingSpråkId: 'ombarna.hvemavbarnaoppholdt.feilmelding',
        avhengighet: barnOppholdtSegTolvMndSammenhengendeINorge,
        avhengigJaNeiSpmSvarCondition: ESvar.NEI,
    });

    const mottarBarnetrygdForBarnFraAnnetEøsland = useJaNeiSpmFelt({
        søknadsfelt: søknad.mottarBarnetrygdForBarnFraAnnetEøsland,
        feilmelding: teksterForSteg.soektYtelseEuEoes.feilmelding,
        feilmeldingSpråkId: 'ombarna.barnetrygd-eøs-fortid.feilmelding',
    });

    const hvemBarnetrygdFraAnnetEøsland = useBarnCheckboxFelt({
        datafeltNavn: barnDataKeySpørsmål.barnetrygdFraAnnetEøsland,
        feilmelding: teksterForSteg.hvemSoektYtelse.feilmelding,
        feilmeldingSpråkId: 'ombarna.barnetrygd-eøs-fortid.hvem.feilmelding',
        avhengighet: mottarBarnetrygdForBarnFraAnnetEøsland,
    });

    const avdødPartnerForelderFeilmelding = () => {
        switch (søknad.erAvdødPartnerForelder.id) {
            case OmBarnaDineSpørsmålId.erOppgittAvdødPartnerForelder:
                return 'ombarna.enkeenkemann.feilmelding';
            case OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder:
                return 'ombarna.enkeenkemann.folkeregisteret-gjenlevende.feilmelding';
            default:
                return 'ombarna.enkeenkemann.folkeregisteret-enke.feilmelding';
        }
    };

    const erAvdødPartnerForelder = useJaNeiSpmFelt({
        søknadsfelt: søknad.erAvdødPartnerForelder,
        feilmelding: avdødPartnerForelderSpørsmålDokument(søknad, teksterForSteg).feilmelding,
        feilmeldingSpråkId: avdødPartnerForelderFeilmelding(),
        skalSkjules: !(
            søknad.søker.sivilstand.type === ESivilstand.ENKE_ELLER_ENKEMANN ||
            søknad.søker.sivilstand.type === ESivilstand.GJENLEVENDE_PARTNER ||
            søknad.søker.utvidet.spørsmål.årsak.svar === Årsak.ENKE_ENKEMANN
        ),
    });

    const hvemAvdødPartner = useBarnCheckboxFelt({
        datafeltNavn: barnDataKeySpørsmål.andreForelderErDød,
        feilmelding: teksterForSteg.hvemAvBarnaAvdoedPartner.feilmelding,
        feilmeldingSpråkId: 'ombarna.enkeenkemann.hvem.feilmelding',
        avhengighet: erAvdødPartnerForelder,
    });

    const harNoenAvBarnaBoddPåSvalbard = useJaNeiSpmFelt({
        søknadsfelt: søknad.harNoenAvBarnaBoddPåSvalbard,
        feilmelding: teksterForSteg.boddPaaSvalbard.feilmelding,
        feilmeldingSpråkId: 'ombarna.boddPaaSvalbard.feilmelding',
        skalSkjules: søknad.søker.borPåSvalbard.svar !== ESvar.JA,
    });

    const hvemHarBoddPåSvalbard = useBarnCheckboxFelt({
        datafeltNavn: barnDataKeySpørsmål.harBoddPåSvalbard,
        feilmelding: teksterForSteg.hvemBoddPaaSvalbard.feilmelding,
        feilmeldingSpråkId: 'ombarna.boddPaaSvalbard.hvem.feilmelding',
        avhengighet: harNoenAvBarnaBoddPåSvalbard,
    });

    useEffect(() => {
        const oppdaterteBarn = genererOppdaterteBarn(
            søknad,
            skjema,
            skalTriggeEøsForBarn,
            erEøsLand
        );

        oppdaterteBarn.forEach(oppdatertBarn => {
            const skalTriggeEøs = skalTriggeEøsForBarn(oppdatertBarn);
            if (
                (skalTriggeEøs && !barnSomTriggerEøs.includes(oppdatertBarn.id)) ||
                (!skalTriggeEøs && barnSomTriggerEøs.includes(oppdatertBarn.id))
            ) {
                settBarnSomTriggerEøs(prevState => {
                    if (skalTriggeEøs) {
                        return prevState.concat(oppdatertBarn.id);
                    } else {
                        return prevState.filter(
                            barnSomTriggetEøsId => barnSomTriggetEøsId !== oppdatertBarn.id
                        );
                    }
                });
            }
        });
    }, [hvemBarnetrygdFraAnnetEøsland]);

    useEffect(() => {
        if (skalNullstilleSvalbardfelter) {
            harNoenAvBarnaBoddPåSvalbard.validerOgSettFelt(null);
            hvemHarBoddPåSvalbard.validerOgSettFelt([]);

            oppdaterSøknad();
        }
    }, [søknad.søker.borPåSvalbard]);

    const oppdaterSøknad = () => {
        const oppdaterteBarn = genererOppdaterteBarn(
            søknad,
            skjema,
            skalTriggeEøsForBarn,
            erEøsLand
        );

        const skalNullstilleEøsForSøker =
            !søknad.søker.triggetEøs && !oppdaterteBarn.find(barn => barn.triggetEøs);

        settSøknad({
            ...søknad,
            søker: skalNullstilleEøsForSøker
                ? { ...søknad.søker, ...nullstilteEøsFelterForSøker(søknad.søker) }
                : søknad.søker,
            erNoenAvBarnaFosterbarn: {
                ...søknad.erNoenAvBarnaFosterbarn,
                svar: erNoenAvBarnaFosterbarn.verdi,
            },
            oppholderBarnSegIInstitusjon: {
                ...søknad.oppholderBarnSegIInstitusjon,
                svar: oppholderBarnSegIInstitusjon.verdi,
            },
            erBarnAdoptertFraUtland: {
                ...søknad.erBarnAdoptertFraUtland,
                svar: erBarnAdoptertFraUtland.verdi,
            },
            søktAsylForBarn: {
                ...søknad.søktAsylForBarn,
                svar: søktAsylForBarn.verdi,
            },
            barnOppholdtSegTolvMndSammenhengendeINorge: {
                ...søknad.barnOppholdtSegTolvMndSammenhengendeINorge,
                svar: barnOppholdtSegTolvMndSammenhengendeINorge.verdi,
            },
            mottarBarnetrygdForBarnFraAnnetEøsland: {
                ...søknad.mottarBarnetrygdForBarnFraAnnetEøsland,
                svar: mottarBarnetrygdForBarnFraAnnetEøsland.verdi,
            },
            harNoenAvBarnaBoddPåSvalbard: {
                ...søknad.harNoenAvBarnaBoddPåSvalbard,
                svar: harNoenAvBarnaBoddPåSvalbard.verdi,
            },
            erAvdødPartnerForelder: {
                ...søknad.erAvdødPartnerForelder,
                svar: erAvdødPartnerForelder.verdi,
            },
            barnInkludertISøknaden: oppdaterteBarn,
            dokumentasjon: søknad.dokumentasjon.map(dok => {
                switch (dok.dokumentasjonsbehov) {
                    case Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE:
                        return {
                            ...dok,
                            gjelderForBarnId: hvemErSøktAsylFor.verdi,
                        };
                    case Dokumentasjonsbehov.ADOPSJON_DATO:
                        return {
                            ...dok,
                            gjelderForBarnId: hvemErAdoptertFraUtland.verdi,
                        };
                    case Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN:
                        return {
                            ...dok,
                            gjelderForBarnId: hvemErFosterbarn.verdi,
                        };
                    default:
                        return dok;
                }
            }),
        });
    };

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IOmBarnaDineFeltTyper,
        string
    >({
        felter: {
            erNoenAvBarnaFosterbarn,
            oppholderBarnSegIInstitusjon,
            erBarnAdoptertFraUtland,
            søktAsylForBarn,
            barnOppholdtSegTolvMndSammenhengendeINorge,
            mottarBarnetrygdForBarnFraAnnetEøsland,
            erAvdødPartnerForelder,
            hvemErFosterbarn,
            hvemErAdoptertFraUtland,
            hvemOppholderSegIInstitusjon,
            hvemBarnetrygdFraAnnetEøsland,
            hvemTolvMndSammenhengendeINorge,
            harNoenAvBarnaBoddPåSvalbard,
            hvemHarBoddPåSvalbard,
            hvemErSøktAsylFor,
            hvemAvdødPartner,
        },
        skjemanavn: 'ombarnadine',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        oppdaterSøknad,
        validerAlleSynligeFelter,
    };
};
