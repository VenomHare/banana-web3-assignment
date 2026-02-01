"use client";
import PasswordBlock from "@/components/CreateBlocks/SetPassword";
import WordsBlock from "@/components/CreateBlocks/Words";
import { ScreenContext } from "@/context/context"
import { ActiveScreen } from "@/lib/types";
import { useContext, useState } from "react"


export default function Page() {
    const [screen, setScreen] = useState<ActiveScreen>("words");

    return (<>
        <ScreenContext.Provider value={{ screen, setScreen }}>
            <div className="w-screen h-dvh overflow-x-hidden bg-background flex items-end justify-center">
                <RenderScreen />
            </div>
        </ScreenContext.Provider>

    </>)
}

const RenderScreen = () => {
    const { screen } = useContext(ScreenContext);
    switch (screen) {
        case "words":
            return <WordsBlock />;
        case "password":
            return <PasswordBlock />
    }
}
