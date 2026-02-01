
export type ActiveScreen = "words" | "password";

export type WordsBlockState = "auto" | "12-words" | "24-words";

export type PopupState = {
    display: "words"
    words: string[]
} | {
    display: "private_key",
    accountIndex: number,
    privateKey: string,
    publicKey: string
}
export interface KeySet {
    publicKey: string
    privateKey: string
}
export interface Account extends KeySet {
    ATAs: {
        usdc : string
    }
}

export type AccountStorage = Account[];
