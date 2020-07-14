export const formaterFnr = (fødselsnummer: string) => {
    return fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6, 11);
};
