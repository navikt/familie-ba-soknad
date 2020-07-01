export type Person = {
    navn: String;
    barn: Array<Barn>;
};

type Barn = {
    ident: String;
    navn: String;
};
