import { prettyDOM, queryByAttribute } from '@testing-library/react';

export const consoleLog = (element?: HTMLElement) => {
    console.log(prettyDOM(element, 10000000));
};
const getById = queryByAttribute.bind(null, 'id');
const getNavn = (container: Element) =>
    getById(container as HTMLElement, 'utvidet-nåværende-samboer-navn') as HTMLInputElement;
const getFnr = (container: Element) =>
    getById(container as HTMLElement, 'utvidet-nåværende-samboer-fnr') as HTMLInputElement;
const getFnrUkjent = (container: Element) =>
    getById(container as HTMLElement, 'utvidet-nåværende-samboer-fnrUkjent') as HTMLInputElement;
const getFødselsdato = (container: Element) =>
    getById(container as HTMLElement, 'utvidet-nåværende-samboer-fødselsdato') as HTMLInputElement;
const getFødselsdatoUkjent = (container: Element) =>
    getById(
        container as HTMLElement,
        'utvidet-nåværende-samboer-fødselsdatoUkjent'
    ) as HTMLInputElement;
const getSamboerFraDato = (container: Element) =>
    getById(
        container as HTMLElement,
        'utvidet-nåværende-samboer-samboerFraDato'
    ) as HTMLInputElement;
export const getAllNåværendeSamboerFields = (container: Element) => {
    return [
        getNavn(container),
        getFnr(container),
        getFnrUkjent(container),
        getFødselsdato(container),
        getFødselsdatoUkjent(container),
        getSamboerFraDato(container),
    ];
};
