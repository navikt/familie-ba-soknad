import React from 'react';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { EtikettSuksess } from 'nav-frontend-etiketter';
import barn1 from '../../../../assets/barn1.svg';
import barn2 from '../../../../assets/barn2.svg';
import barn3 from '../../../../assets/barn3.svg';
import { useApp } from '../../../../context/AppContext';
import { IBarn, ISøknadsfelt } from '../../../../typer/søknad';

const Barnekort: React.FC<IBarn> = ({ navn, ident, alder, borMedSøker, medISøknad }) => {
    const { søknad, settSøknad } = useApp();

    function settMedISøknad(erMed: boolean) {
        settSøknad({
            ...søknad,
            barn: søknad.barn.map(barn =>
                barn.ident === ident
                    ? { ...barn, medISøknad: { ...barn.medISøknad, verdi: erMed } }
                    : barn
            ),
        });
    }

    function fjernBarnFraSøknad() {
        settMedISøknad(false);
    }

    function leggTilBarnISøknad() {
        settMedISøknad(true);
    }

    const ikoner = [barn1, barn2, barn3];
    const ikon = ikoner[Math.floor(Math.random() * ikoner.length)];

    return (
        <div className="barnekort">
            <div className="barnekort__header">
                <img alt="barn" className="barneikon" src={ikon} />
            </div>
            <div className="barnekort__informasjonsboks">
                <div className="informasjonsboks-innhold">
                    <Element>{navn.verdi}</Element>
                    <BarneKortInfo {...ident} />
                    <BarneKortInfo {...alder} />
                    <BarneKortInfo {...borMedSøker} />
                    <div className="knappe-container">
                        {!medISøknad.verdi && (
                            <Knapp mini onClick={leggTilBarnISøknad}>
                                Legg til i søknad
                            </Knapp>
                        )}
                        {medISøknad.verdi && (
                            <>
                                <EtikettSuksess className={'med-i-søknad'}>
                                    {medISøknad.label}
                                </EtikettSuksess>
                                <Normaltekst>
                                    <div className="lenke fjern-barn" onClick={fjernBarnFraSøknad}>
                                        {'Fjern fra søknad'}
                                    </div>
                                </Normaltekst>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const BarneKortInfo: React.FC<ISøknadsfelt<any>> = ({ label, verdi }) => {
    return (
        <div className="informasjonselement">
            <Normaltekst>{label.toLocaleUpperCase()}</Normaltekst>
            <Normaltekst>{verdi}</Normaltekst>
        </div>
    );
};

export default Barnekort;
