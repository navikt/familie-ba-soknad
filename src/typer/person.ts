export type Person = {
    navn: String;
    barn: Barn[];
};

type Barn = {
    ident: String;
    navn: String;
};
