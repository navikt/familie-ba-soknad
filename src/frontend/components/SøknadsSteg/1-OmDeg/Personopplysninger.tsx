import React, { useState } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Input } from 'nav-frontend-skjema';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { ESvar, JaNeiSpørsmål } from '@navikt/familie-form-elements';
import { Avhengigheter, feil, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { ESivilstand } from '../../../typer/person';
import { StyledAlertStripe, FeltGruppe, KomponentGruppe } from './layoutKomponenter';
import { SøkerBorIkkePåAdresse } from './SøkerBorIkkePåAdresse';
import { hentSivilstatus, landkodeTilSpråk } from './utils';

const StyledInput = styled(Input)`
    label {
        font-size: 1.125rem;
    }
`;

const PersonopplysningerSection = styled.section`
    text-align: left;

    p {
        font-size: 1.125rem;
    }
`;

export const Personopplysninger: React.FC = () => {
    const [feilTelefonnr, settFeilTelefonnr] = useState<boolean>(false);
    const [søkerBorPåRegistrertAdresse, setSøkerBorPåRegistrertAdresse] = useState<
        boolean | undefined
    >();

    const intl = useIntl();

    const { søknad, settSøknad } = useApp();
    const søker = søknad.søker;
    const telefonnummer = useFelt<string>({
        verdi: søker.kontakttelefon,
        valideringsfunksjon: (felt: FeltState<string>, avhengigheter) => {
            return felt.verdi.length >= 8 && /^[+\d\s]+$/.test(felt.verdi)
                ? ok(felt)
                : feil(
                      felt,
                      avhengigheter?.intl.formatMessage({
                          id: 'personopplysninger.feilmelding.telefonnr',
                      }) ?? ''
                  );
        },
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            const { søkerBorPåRegistrertAdresse } = avhengigheter;
            return søkerBorPåRegistrertAdresse.value ? true : false;
        },
        avhengigheter: {
            søkerBorPåRegistrertAdresse: søkerBorPåRegistrertAdresse ?? false,
            intl: intl,
        },
    });

    const oppdaterTelefonnr = (event: React.FormEvent<HTMLInputElement>) => {
        const telefonnr = event.currentTarget.value;
        settSøknad({
            ...søknad,
            søker: {
                ...søker,
                kontakttelefon: telefonnr,
            },
        });
    };

    const oppdaterFeilmelding = (e: React.FormEvent<HTMLInputElement>) => {
        e.currentTarget.value.length >= 8 && /^[+\d\s]+$/.test(e.currentTarget.value)
            ? settFeilTelefonnr(false)
            : settFeilTelefonnr(true);
    };

    const borDuPåRegistrertAdresseOnChange = (verdi: ESvar) => {
        setSøkerBorPåRegistrertAdresse(verdi === ESvar.JA);
    };

    return (
        <PersonopplysningerSection aria-live={'polite'}>
            <KomponentGruppe>
                <FeltGruppe>
                    <StyledAlertStripe type={'info'} form={'inline'}>
                        <p>
                            <FormattedMessage id={'personopplysninger.alert.infohentet'} />
                        </p>
                    </StyledAlertStripe>
                </FeltGruppe>

                <FeltGruppe>
                    <Element>
                        <FormattedMessage id={'person.ident.visning'} />
                    </Element>
                    <Normaltekst>TODO: Søkers ident</Normaltekst>
                </FeltGruppe>

                <FeltGruppe>
                    <Element>
                        <FormattedMessage id={'person.statsborgerskap'} />
                    </Element>
                    <Normaltekst>
                        {søker.statsborgerskap
                            .map((landkode: string) => landkodeTilSpråk(landkode, intl.locale))
                            .join(', ')}
                    </Normaltekst>
                </FeltGruppe>

                <FeltGruppe>
                    <Element>
                        <FormattedMessage id={'sivilstatus.tittel'} />
                    </Element>
                    <Normaltekst>
                        <FormattedMessage id={hentSivilstatus(ESivilstand.ENKE_ELLER_ENKEMANN)} />{' '}
                        {/* TODO */}
                    </Normaltekst>
                </FeltGruppe>

                <FeltGruppe>
                    <Element>
                        <FormattedMessage id={'person.adresse'} />
                    </Element>
                    <Normaltekst>TODO: Søkers adresse</Normaltekst>
                    <Normaltekst>TODO: postnummer og poststed</Normaltekst>
                </FeltGruppe>
            </KomponentGruppe>

            <KomponentGruppe aria-live="polite">
                <JaNeiSpørsmål
                    legend={
                        <>
                            <Element>
                                <FormattedMessage id={'personopplysninger.spm.riktigAdresse'} />
                            </Element>
                            <Normaltekst>
                                <FormattedMessage
                                    id={'personopplysninger.lesmer-innhold.riktigAdresse'}
                                />
                            </Normaltekst>
                        </>
                    }
                    onChange={borDuPåRegistrertAdresseOnChange}
                    name={'RegistrertAdresseStemmer'}
                    labelTekstForJaNei={{
                        ja: <FormattedMessage id={'ja'} />,
                        nei: <FormattedMessage id={'nei'} />,
                    }}
                />

                {søkerBorPåRegistrertAdresse === false && (
                    <SøkerBorIkkePåAdresse lenkePDFSøknad={'https://nav.no'} /> //TODO
                )}
            </KomponentGruppe>

            {telefonnummer.erSynlig && (
                <StyledInput
                    {...telefonnummer.hentNavInputProps(true)}
                    name={'Telefonnummer'}
                    label={<FormattedMessage id={'person.telefonnr'} />}
                    bredde={'M'}
                    type="tel"
                    onChange={e => oppdaterTelefonnr(e)}
                    onBlur={e => oppdaterFeilmelding(e)}
                    feil={
                        feilTelefonnr ? (
                            <FormattedMessage id={'personopplysninger.feilmelding.telefonnr'} />
                        ) : undefined
                    }
                    value={søknad.søker.kontakttelefon}
                />
            )}
        </PersonopplysningerSection>
    );
};
