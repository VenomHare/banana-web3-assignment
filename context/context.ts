import { createContext, RefObject } from "react";
import type { ActiveScreen } from "./../lib/types";
import { useWeb3 } from "@/components/useWeb3";

interface ScreenContextType {
    screen: ActiveScreen,
    setScreen: (s: ActiveScreen) => void
}

export const ScreenContext = createContext<ScreenContextType>({
    screen: "create",
    setScreen: (s: string) => { alert(s) }
})

export const Web3Context = createContext<ReturnType<typeof useWeb3> | null>(null);
