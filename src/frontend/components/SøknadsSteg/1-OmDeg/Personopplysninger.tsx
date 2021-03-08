import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Input } from 'nav-frontend-skjema';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { ESvar, JaNeiSpørsmål } from '@navikt/familie-form-elements';
import { Avhengigheter, feil, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { ESivilstand } from '../../../typer/person';
import { FeltGruppe, KomponentGruppe, StyledAlertStripe } from './layoutKomponenter';
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
    const intl = useIntl();

    const { søknad } = useApp();
    const søker = søknad.søker;

    const borPåRegistrertAdresse = useFelt<ESvar | undefined>({
        verdi: undefined,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi === ESvar.JA
                ? ok(felt)
                : feil(
                      felt,
                      <FormattedMessage
                          id={'personopplysninger.feilmelding.borpåregistrertadresse'}
                      />
                  );
        },
    });

    const telefonnummer = useFelt<string>({
        verdi: søker.kontakttelefon,
        valideringsfunksjon: (felt: FeltState<string>) => {
            return felt.verdi.length >= 8 && /^[+\d\s]+$/.test(felt.verdi)
                ? ok(felt)
                : feil(felt, <FormattedMessage id={'personopplysninger.feilmelding.telefonnr'} />);
        },
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            const { søkerMåOppgiTlf } = avhengigheter;
            return søkerMåOppgiTlf;
        },
        avhengigheter: {
            søkerMåOppgiTlf: borPåRegistrertAdresse.verdi === ESvar.JA,
        },
    });

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
                    {...borPåRegistrertAdresse.hentNavInputProps(true)}
                    name={'søker.borpåregistrertadresse'}
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
                    labelTekstForJaNei={{
                        ja: <FormattedMessage id={'ja'} />,
                        nei: <FormattedMessage id={'nei'} />,
                    }}
                />

                {borPåRegistrertAdresse.verdi === ESvar.NEI && (
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
                />
            )}
        </PersonopplysningerSection>
    );
};
