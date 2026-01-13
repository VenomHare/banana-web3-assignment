
export type ActiveScreen = "create" | "12-words" | "24-words" | "words" | "wallet";


export interface KeySet {
    publicKey: string
    privateKey: string
}
export type Account = {
    solana: KeySet,
    ethereum: KeySet
};