export interface Person {
    navn: string;
    barn: Barn[];
}

interface Barn {
    ident: string;
    navn: string;
}
