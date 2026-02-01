import { cn } from "@/lib/utils"
import { Ellipsis } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react"
import ContextMenu from "./ContextMenu";
import Popup from "./popups/Popup";
import { PopupState } from "@/lib/types";
import PasswordPopup from "./popups/PasswordPopup";
import { AccountsContext } from "@/context/context";
import { RpcId } from "@/lib/web3";

interface HeadingBlockProps {
    setRpcId: React.Dispatch<React.SetStateAction<RpcId>>
}

export const HeadingBlock = ({  setRpcId }: HeadingBlockProps) => {
    const [isContextOpen, setIsContextOpen] = useState(false);
    const [popup, setPopup] = useState(false);
    const [passwordPopup, setPasswordPopup] = useState(false);
    const [popupState, setPopupState] = useState<PopupState>();
    const [loggedIn, setLoggedIn] = useState(false);
    const approveFunc = useRef<() => void>(() => { });

    const { accounts, activeAccount, updateBalance, rpcId } = useContext(AccountsContext);

    useEffect(() => {
        let to: NodeJS.Timeout;
        if (loggedIn) {
            to = setTimeout(() => {
                setLoggedIn(false);
            }, 5 * 60 * 1000);
        }
        return () => {
            clearTimeout(to);
        }
    }, [loggedIn])

    function OnPrivateClick() {
        const show = () => {
            setPopupState({
                display: "private_key",
                publicKey: accounts[activeAccount].publicKey,
                privateKey: accounts[activeAccount].privateKey,
                accountIndex: activeAccount
            });
            setPopup(true);
        }
        if (!loggedIn) {
            approveFunc.current = show;
            setPasswordPopup(true);
        }
        else {
            show();
        }
    }

    function OnRecoveryClick() {

        const show = () => {
            setPopupState({
                display: "words",
                words: localStorage.getItem("mnemonic")?.split(" ") ?? []
            });
            setPopup(true);
        }
        if (!loggedIn) {
            approveFunc.current = show;
            setPasswordPopup(true);
        }
        else {
            show();
        }
    }
    function onSwapClick() {
        setRpcId(prev => prev == "devnet" ? "testnet" : "devnet");
        updateBalance();
    }
    return (
        <>
            <div className="w-full mt-10 mb-2 flex items-center justify-between">
                <div className="">
                    <h3 className="text-4xl font-sans ">Account {(activeAccount + 1).toString().padStart(2, '0')}</h3>
                    <p className="font-sans text-sm text-accent-foreground/40">Derivation Path: m/44'/501'/{activeAccount}'/0</p>
                </div>
                <div
                    className={cn(
                        "p-2 rounded hover:bg-accent-foreground/10 relative",
                        isContextOpen && "bg-secondary  rounded-b-[1px]"
                    )}
                    onClick={() => { setIsContextOpen(prev => !prev) }}
                >
                    <Ellipsis />
                    {
                        isContextOpen &&
                        <ContextMenu
                            onPrivateKeyClick={OnPrivateClick}
                            onRecoveryClick={OnRecoveryClick}
                            onSwapClick={onSwapClick}
                            rpcId={rpcId}
                        />
                    }
                </div>
            </div>

            <Popup
                open={popup}
                setOpen={setPopup}
                state={popupState}
            />
            <PasswordPopup
                open={passwordPopup}
                setOpen={setPasswordPopup}
                onApprove={() => {
                    setLoggedIn(true);
                    approveFunc.current?.();
                }}
            />
        </>
    )
}
