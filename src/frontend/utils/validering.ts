export const regexNorskEllerUtenlandskPostnummer = (verdi: string) =>
    verdi.match(/^[A-Za-z0-9-æøåÆØÅ-]{3,10}$/);
