import { generateMnemonic } from "bip39";
import { useState } from "react";
import bs58 from 'bs58'
import * as bip39 from "bip39"
import { Account } from "@/lib/types";
import { HDKey } from "micro-ed25519-hdkey";
import { createKeyPairSignerFromPrivateKeyBytes } from "@solana/kit";
import { ethers } from "ethers";
import { toast } from "sonner";

export const useWeb3 = () => {
    const [words, setWords] = useState<string[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);
    const generateWords = () => {
        const words = generateMnemonic(128);
        setWords(words.split(" "));
    }

    const generateSolanaKeys = async (index: number, pharse?: string[]) => {
        const safeWords = pharse ?? words
        const seed = bip39.mnemonicToSeedSync(safeWords.join(" "));
        const hd = HDKey.fromMasterSeed(seed.toString("hex"))
        const path = `m/44'/501'/${index}'/0'`;
        const child = hd.derive(path);
        const signer = await createKeyPairSignerFromPrivateKeyBytes(
            new Uint8Array(child.privateKey)
        );

        return {
            publicKey: signer.address,
            privateKey: bs58.encode(child.privateKey.subarray(0, 32))
        };
    }


    const generateEthereumKeys = (index: number, pharse?: string[]) => {
        const path = `m/44'/60'/${index}'/0'`
        const safeWords = pharse ?? words
        const node = ethers.Wallet.fromMnemonic(safeWords.join(" "), path);

        return {
            publicKey: node.address,
            privateKey: node.privateKey
        }
    }

    const createNewAccount = async (words?: string[]) => {
        if (loading) { return }
        if (words) {
            setWords(words);
            await new Promise(res => setTimeout(res, 200))
        }
        setLoading(true);
        const index = accounts.length;
        const sol = await generateSolanaKeys(index, words);
        const eth = generateEthereumKeys(index, words);

        setAccounts(prev => {
            const exist = [...prev];
            exist.push({
                solana: sol,
                ethereum: eth
            })
            return exist
        })
        toast.success("Created New Account!");  
        setLoading(false);
    }


    return {
        words,
        setWords,
        loading,
        generateWords,
        generateSolanaKeys,
        generateEthereumKeys,
        accounts,
        createNewAccount,
    }
}