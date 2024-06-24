import React from 'react';

import { Label } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import FamilieAlert from '../../Felleskomponenter/FamilieAlert/FamilieAlert';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import Tilleggsinformasjon from '../../Felleskomponenter/Tilleggsinformasjon';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { UtenlandsoppholdModal } from '../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsoppholdModal';
import { UtenlandsperiodeOppsummering } from '../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsperiodeOppsummering';
import { useApp } from '../../../context/AppContext';

import { Personopplysninger } from './Personopplysninger';
import { OmDegSpørsmålId, omDegSpørsmålSpråkId } from './spørsmål';
import { useOmdeg } from './useOmdeg';

const OmDeg: React.FC = () => {
    const { tekster, plainTekst } = useApp();

    const {
        erÅpen: utenlandsoppholdmodalErÅpen,
        lukkModal: lukkUtenlandsoppholdmodal,
        åpneModal: åpneUtenlandsoppholdmodal,
    } = useModal();

    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
        utenlandsperioder,
    } = useOmdeg();

    /* 
    TODO:  
    1. Lag generisk funksjonalitet for å finne hjelpetekst basert på periodetype (f.eks. arbeidsperiode), antall perioder (f.eks. registrerteArbeidsperioder.verdi.length).
    2. Feature toggle for å bytte mellom visning av hjelpetekst gjennom LeggTilKnapp vs bruk av Label over LeggTilKnapp.
    */
    let leggTilPeriodeKnappHjelpetekst: string | undefined = undefined;

    try {
        /* De fleste andre steder brukes tidligereSamboere[personType], skal det her da stå søker istedet? */
        const modal = tekster()['FELLES'].modaler.utenlandsopphold.søker;
        leggTilPeriodeKnappHjelpetekst =
            utenlandsperioder.length === 0
                ? plainTekst(modal.leggTilPeriodeKnappHjelpetekst)
                : plainTekst(modal.flerePerioder);
    } catch (error) {
        console.error('Kunne ikke "Legg til periode-knapp hjelpetekst"', error);
    }

    return (
        <Steg
            tittel={<SpråkTekst id={'omdeg.sidetittel'} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <KomponentGruppe>
                <Personopplysninger />
            </KomponentGruppe>

            <KomponentGruppe>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.borPåRegistrertAdresse}
                    spørsmålTekstId={omDegSpørsmålSpråkId[OmDegSpørsmålId.borPåRegistrertAdresse]}
                />

                {skjema.felter.borPåRegistrertAdresse.verdi === ESvar.NEI && (
                    <FamilieAlert variant={'warning'}>
                        <SpråkTekst
                            id={'omdeg.borpådenneadressen.kontakt-folkeregister-ukjent.alert'}
                        />
                    </FamilieAlert>
                )}
            </KomponentGruppe>
            <KomponentGruppe>
                <>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.værtINorgeITolvMåneder}
                        spørsmålTekstId={
                            omDegSpørsmålSpråkId[OmDegSpørsmålId.værtINorgeITolvMåneder]
                        }
                        tilleggsinfo={
                            <FamilieAlert variant={'info'}>
                                <SpråkTekst id={'felles.korteopphold.info'} />
                            </FamilieAlert>
                        }
                    />
                    {skjema.felter.værtINorgeITolvMåneder.verdi === ESvar.NEI && (
                        <Tilleggsinformasjon>
                            {utenlandsperioder.map((periode, index) => (
                                <UtenlandsperiodeOppsummering
                                    key={index}
                                    periode={periode}
                                    nummer={index + 1}
                                    fjernPeriodeCallback={fjernUtenlandsperiode}
                                />
                            ))}
                            {/* {utenlandsperioder.length > 0 && (
                                <Label as="p" spacing>
                                    <SpråkTekst id={'omdeg.flereopphold.spm'} />
                                </Label>
                            )} */}
                            <LeggTilKnapp
                                onClick={åpneUtenlandsoppholdmodal}
                                språkTekst={'felles.leggtilutenlands.knapp'}
                                hjelpeTekst={leggTilPeriodeKnappHjelpetekst}
                                id={UtenlandsoppholdSpørsmålId.utenlandsopphold}
                                feilmelding={
                                    skjema.felter.registrerteUtenlandsperioder.erSynlig &&
                                    skjema.felter.registrerteUtenlandsperioder.feilmelding &&
                                    skjema.visFeilmeldinger && (
                                        <SpråkTekst id={'felles.leggtilutenlands.feilmelding'} />
                                    )
                                }
                            />
                        </Tilleggsinformasjon>
                    )}
                </>
                {skjema.felter.planleggerÅBoINorgeTolvMnd.erSynlig && (
                    <KomponentGruppe inline dynamisk>
                        <JaNeiSpm
                            skjema={skjema}
                            felt={skjema.felter.planleggerÅBoINorgeTolvMnd}
                            spørsmålTekstId={
                                omDegSpørsmålSpråkId[OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd]
                            }
                        />
                        {skjema.felter.planleggerÅBoINorgeTolvMnd.erSynlig &&
                            skjema.felter.planleggerÅBoINorgeTolvMnd.verdi === ESvar.NEI && (
                                <FamilieAlert variant={'warning'} dynamisk>
                                    <SpråkTekst
                                        id={'omdeg.planlagt-opphold-sammenhengende.alert'}
                                    />
                                </FamilieAlert>
                            )}
                    </KomponentGruppe>
                )}
            </KomponentGruppe>
            {utenlandsoppholdmodalErÅpen && (
                <UtenlandsoppholdModal
                    erÅpen={utenlandsoppholdmodalErÅpen}
                    lukkModal={lukkUtenlandsoppholdmodal}
                    onLeggTilUtenlandsperiode={leggTilUtenlandsperiode}
                />
            )}
        </Steg>
    );
};

export default OmDeg;
