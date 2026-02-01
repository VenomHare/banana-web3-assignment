import React, { FormEvent, useContext, useMemo, useState } from "react"
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { AtSign, MoveRight } from "lucide-react";
import { toast } from "sonner";
import { cn, truncateKey } from "@/lib/utils";
import { AccountsContext } from "@/context/context";
import { PublicKey } from "@solana/web3.js";
import { getSolanaBalance, sendSolana } from "@/lib/web3";
import PasswordPopup from "./PasswordPopup";

interface SendPopupProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const SendPopupProps = ({ open, setOpen }: SendPopupProps) => {
    if (!open) {
        return (<></>)
    }

    const [pubKey, setPubkey] = useState("");
    const [closing, setClosing] = useState(false);
    const [existingAddress, setExistingAddress] = useState(false);
    const [amount, setAmount] = useState(0.001);
    const { accounts, activeAccount, rpcId } = useContext(AccountsContext);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState(false);

    const transfer = async () => {
        setLoading(true);
        await sendSolana(rpcId, amount, accounts[activeAccount], pubKey);
        setLoading(false);
        closePopup();
    }

    const closePopup = () => {
        setClosing(true);
        setTimeout(() => {
            setOpen(false);
        }, 800);
    }

    const isValid = useMemo(() => {
        try {
            const key = new PublicKey(pubKey);
            return PublicKey.isOnCurve(key.toBytes());
        }
        catch {
            return false;
        }
    }, [pubKey])

    const validateAndVerify = async (e: FormEvent) => {
        setLoading(true);
        e.preventDefault();
        if (isNaN(amount)) {
            setLoading(false);
            return
        }
        if (amount < 0.001) {
            toast.warning("Minimum 0.001 SOL required");
            setLoading(false);
            return;
        }
        const available = await getSolanaBalance(rpcId, accounts[activeAccount].publicKey);
        if (amount > available) {
            toast.warning(`Insufficient Balance (max ${available})`);
            setLoading(false);
            return
        }
        setPassword(true);
    }

    return (
        <>
            <div className="w-screen h-screen backdrop-blur-2xl fixed top-0 right-0 z-10 flex justify-center items-end">

                <div className={cn(
                    "w-full md:max-w-xl overflow-y-auto md:overflow-y-clip shadow h-full md:h-auto md:min-h-[80dvh] pt-10 md:rounded-3xl md:rounded-b-none ",
                    "bg-linear-to-br from-[#1f2029] to-accent transition-all duration-100 ",
                    closing ? "animate-popdown" : "animate-popup"
                )}>
                    <div className="w-full flex items-center justify-center mt-15 mb-5 gap-2 group">
                        <img src="/banana.png" className="w-[50px] h-[50px] aspect-square object-contain group-hover:scale-[1.05] group-hover:rotate-10 transition-all duration-100" alt="Logo" />
                        <h1 className="text-5xl font-salsa font-semibold">Banana</h1>
                    </div>
                    <h2 className="text-center text-lg font-sans">Web3 HD Wallet</h2>
                    <h3 className="text-center text-4xl font-sans mt-10">
                        Send Solana
                    </h3>
                    <form className="w-3/5 mx-auto flex flex-col items-start gap-1 my-5" onSubmit={validateAndVerify}>
                        <label htmlFor="pub-key" className="font-sans">Receiver's Address</label>
                        <div className="w-full flex items-center justify-between gap-1 relative">
                            <Input
                                className="w-full  font-sans grow"
                                type="text"
                                placeholder="Public Key"
                                id="pub-key"
                                value={pubKey}
                                onChange={(e) => setPubkey(e.target.value)}
                            />
                            <Button variant={"secondary"} type="button" className={cn(
                                existingAddress ? "rounded-b-none" : "rounded"
                            )} onClick={() => { setExistingAddress(prev => !prev) }}>
                                <AtSign className="" />
                            </Button>
                            {
                                existingAddress &&
                                <div className="absolute top-full w-full bg-secondary z-10 rounded-b-lg flex flex-col gap-1 ">
                                    {
                                        accounts.map((keys, i) => (
                                            i !== activeAccount &&
                                            <Button
                                                key={i}
                                                variant={"ghost"}
                                                type="button"
                                                onClick={() => {
                                                    setPubkey(keys.publicKey);
                                                    setExistingAddress(false);
                                                }}
                                                className="w-full flex items-center justify-between font-sans border-b border-border/40 rounded-none last:border-none"
                                            >
                                                <p>Account {i + 1}</p>
                                                <p>{truncateKey(keys.publicKey, 4)}</p>
                                            </Button>
                                        ))
                                    }
                                </div>
                            }
                        </div>

                        <label htmlFor="amount" className="font-sans mt-6">Amount</label>
                        <div className="w-full flex items-center justify-between gap-1 ">
                            <Input
                                className="w-full font-sans grow"
                                type="number"
                                placeholder="0.00"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value))}
                            />
                        </div>

                        <Button type="submit" className="w-3/5 mx-auto mt-6" disabled={!isValid || loading}>
                            Send
                            <MoveRight />
                        </Button>
                        <Button variant={"outline"} type="button" className="w-3/5 mx-auto mt-2" onClick={() => { closePopup() }}>
                            Cancel
                        </Button>
                    </form>
                </div>
            </div>
            <PasswordPopup
                open={password}
                setOpen={setPassword}
                onApprove={transfer}
            />
        </>
    )
}


export default SendPopupProps