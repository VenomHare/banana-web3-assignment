import React, { createContext, RefObject } from "react";
import type { AccountStorage, ActiveScreen, KeySet } from "./../lib/types";
import { RpcId } from "@/lib/web3";

interface ScreenContextType {
    screen: ActiveScreen,
    setScreen: (s: ActiveScreen) => void
}

export const ScreenContext = createContext<ScreenContextType>({
    screen: "words",
    setScreen: (s: string) => { alert(s) }
})


interface AccountsContextType {
    accounts: KeySet[],
    setAccounts: React.Dispatch<React.SetStateAction<AccountStorage>>,
    activeAccount: number
    rpcId: RpcId,
    updateAccounts: () => void
    updateBalance: () => void
}

export const AccountsContext = createContext<AccountsContextType>({
    accounts: [],
    setAccounts: () => {},
    activeAccount: 0,
    rpcId: "devnet",
    updateAccounts: () => {},
    updateBalance: () => {}
})
