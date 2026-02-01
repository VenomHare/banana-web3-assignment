
import bip39 from 'bip39'
import { HDKey } from "micro-ed25519-hdkey";
import bs58 from "bs58";
import { address, Address, airdropFactory, appendTransactionMessageInstruction, appendTransactionMessageInstructions, assertIsTransactionWithBlockhashLifetime, createKeyPairSignerFromPrivateKeyBytes, createSignerFromKeyPair, createSolanaRpc, createSolanaRpcSubscriptions, createTransactionMessage, generateKeyPairSigner, getSignatureFromTransaction, lamports, pipe, sendAndConfirmDurableNonceTransactionFactory, sendAndConfirmTransactionFactory, setTransactionMessageFeePayer, setTransactionMessageFeePayerSigner, setTransactionMessageLifetimeUsingBlockhash, signTransactionMessageWithSigners } from "@solana/kit";
import { Account, AccountStorage, KeySet } from "./types";
import { getTransferSolInstruction } from '@solana-program/system';
import { fromLegacyKeypair } from '@solana/compat';
import { Keypair } from '@solana/web3.js';
import { toast } from 'sonner';
import { findAssociatedTokenPda, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token';

export const generateSolanaKeys = async (index: number, pharse: string) => {
    const seed = bip39.mnemonicToSeedSync(pharse);
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

export const RpcUrls = {
    "devnet": "https://api.devnet.solana.com",
    "testnet": "https://api.testnet.solana.com"
}
export type RpcId = keyof typeof RpcUrls;
export const RpcWSUrls = {
    "devnet": "wss://api.devnet.solana.com",
    "testnet": "wss://api.testnet.solana.com"
}

export const generateAndSaveNewAccount = async (pharse: string) => {
    try {
        const existStr = localStorage.getItem("accounts");
        if (!existStr) {
            const keySet = await generateSolanaKeys(0, pharse);
            const usdcATA = await createUSDC_SPL_ATA(keySet.publicKey);
            const account: Account = {
                ...keySet,
                ATAs: {
                    usdc: usdcATA
                }
            }
            localStorage.setItem("accounts", JSON.stringify([account]));
            return true;
        }
        else {
            const existingAccounts: AccountStorage = JSON.parse(existStr);
            const newAccIndex = existingAccounts.length;
            const keySet = await generateSolanaKeys(newAccIndex, pharse);
            const usdcATA = await createUSDC_SPL_ATA(keySet.publicKey);
            const account: Account = {
                ...keySet,
                ATAs: {
                    usdc: usdcATA
                }
            }
            localStorage.setItem("accounts", JSON.stringify([...existingAccounts, account]));
            return true;
        }
    }
    catch {
        return false;
    }
}

export const createATA = async (ownerAddress: string, mintAddress: string) => {
    const MINT = address(mintAddress);
    const OWNER = address(ownerAddress);

    const [associatedTokenAddress] = await findAssociatedTokenPda({
        mint: MINT,
        owner: OWNER,
        tokenProgram: TOKEN_PROGRAM_ADDRESS
    })
    // console.log("✅ Found ATA:", associatedTokenAddress);
    return associatedTokenAddress;
}

export const createUSDC_SPL_ATA = async (ownerAddress: string) => {
    const DEVNET_MINT_ADDRESS = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
    // const MAINNET_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

    return await createATA(ownerAddress, DEVNET_MINT_ADDRESS);
}

export const getSolanaBalance = async (rpcId: RpcId, publicKey: string) => {
    const rpc = createSolanaRpc(RpcUrls[rpcId]);
    const address = publicKey as Address;
    const { value } = await rpc.getBalance(address).send();
    return (Number(value) / 1_000_000_000)
}

export const getUSDCBalance = async (rpcId: RpcId, adr: string) => {
    try {

        const tokenAddress = address(adr);
        const rpc = createSolanaRpc(RpcUrls[rpcId]);
        const { value } = await rpc.getTokenAccountBalance(tokenAddress).send();
        // console.log("✅ Recieved usdc balance", Number(value.amount) / Math.pow(10, value.decimals));
        return Number(value.amount) / Math.pow(10, value.decimals)
    }
    catch {
        return 0
    }
}


export const sendSolana = async (rpcId: RpcId, amount: number, sender: KeySet, receiver: string) => {
    try {
        const rpc = createSolanaRpc(RpcUrls[rpcId]);
        const rpcSubscriptions = createSolanaRpcSubscriptions(RpcWSUrls[rpcId]);

        const KeyPair = new Keypair({
            publicKey: new Uint8Array(bs58.decode(sender.publicKey)),
            secretKey: new Uint8Array(bs58.decode(sender.privateKey)),
        });
        const senderCreds = await fromLegacyKeypair(KeyPair);

        const senderSigner = await createSignerFromKeyPair(senderCreds);
        const LAMPORTS_PER_SOL = 1_000_000_000n;
        const transferAmount = lamports(BigInt(Math.floor(amount * Number(LAMPORTS_PER_SOL))));

        const transferInstruction = getTransferSolInstruction({
            source: senderSigner,
            destination: receiver as Address,
            amount: transferAmount
        })

        const { value: LatestBlockHash } = await rpc.getLatestBlockhash().send();
        const transactionMessage = pipe(
            createTransactionMessage({ version: 0 }),
            (tx) => setTransactionMessageFeePayerSigner(senderSigner, tx),
            (tx) => setTransactionMessageLifetimeUsingBlockhash(LatestBlockHash, tx),
            (tx) => appendTransactionMessageInstructions([transferInstruction], tx),
        )


        const signedTransaction =
            await signTransactionMessageWithSigners(transactionMessage);
        assertIsTransactionWithBlockhashLifetime(signedTransaction);
        const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
        await sendAndConfirmTransaction(signedTransaction, { commitment: "confirmed" })


        const transactionSignature = getSignatureFromTransaction(signedTransaction);
        // console.log("✅ - Transfer transaction Signature ", transactionSignature);
        toast.success("Transfer Successful!");
    }
    catch (err) {
        console.log(err);
        toast.error("Failed to process transaction!");
    }
}


export const getLatestSolanaPrice = async () => {
    try {
        const d = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
        const data = await d.json();
        if (d.status == 200) {
            return parseFloat(data.solana.usd);
        }
        else {
            throw new Error("failed");
        }
    }
    catch {
        toast.error("Failed to load latest SOL Prices");
    }
}