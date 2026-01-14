'use client';

import { CreateScreen } from "@/components/CreateScreen";
import { ScreenContext, Web3Context } from "@/context/context";
import { useContext, useEffect, useRef, useState } from "react";
import { ActiveScreen } from "@/lib/types";
import { cn } from "@/lib/utils";
import { WordsScreen } from "@/components/WordsScreen";
import { TwelveWordsScreen } from "@/components/TwelveWordsScreen";
import { TwentyFourWordsScreen } from "@/components/TwentyFourWordsScreen";
import { WalletScreen } from "@/components/WalletScreen";
import { useWeb3 } from "@/components/useWeb3";
import { ModeToggle } from "@/components/ThemeButton";

export default function Home() {
    const [screen, setScreen] = useState<ActiveScreen>("create");
    const titleRef = useRef<HTMLDivElement | null>(null);
    const hook = useWeb3();

    return (<>
        <ModeToggle/>
        <ScreenContext.Provider value={{ screen, setScreen }}>
            <Web3Context.Provider value={hook}>
                <RenderScreen />
                <BackgroundProp />
            </Web3Context.Provider>
        </ScreenContext.Provider>
    </>);
}

const RenderScreen = () => {

    const { screen } = useContext(ScreenContext);

    switch (screen) {
        default: return (<></>);
        case "create":
            return <CreateScreen />;
        case "words":
            return <WordsScreen />;
        case "12-words":
            return <TwelveWordsScreen />;
        case "24-words":
            return <TwentyFourWordsScreen />;
        case "wallet":
            return <WalletScreen />
    }
}

const BackgroundProp = () => {
    const { screen }: { screen: ActiveScreen } = useContext(ScreenContext);

    return (<div className="w-screen h-dvh flex items-center justify-center fixed top-0 left-0 pointer-events-none">
        <div
            className={cn(
                "background-bubble bg-primary/30 dark:bg-primary/10",
                screen === "12-words" ? "words12" :
                    screen === "24-words" ? "words24" :
                        screen
            )}
        >
        </div>
    </div>);
}

