import { ScreenContext } from "@/context/context"
import { useContext, useMemo, useState } from "react"
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const TwentyFourWordsScreen = () => {
    const { setScreen } = useContext(ScreenContext);
    const [words, setWords] = useState<string[]>(Array.from({ length: 24 }).map(() => ""));

    const isValid = useMemo(() => {
        return words.every((e) => {
            return e.trim() !== "" && e.trim().split(" ").length == 1
        })
    },[words])

    return (<>
        <div className="max-h-dvh h-dvh w-screen animate-popin overflow-y-auto">
            <div className="w-full max-w-7xl h-full mx-auto flex flex-col items-center justify-center gap-5 ">
                <div className="w-9/10 md:w-6/10 mb-5 flex flex-col gap-2 justify-start">
                    <div className="flex items-center">
                        <img src="/banana.png" className="w-[50px] h-[50px] md:w-[75px] md:h-[75px] aspect-square object-contain" alt="Logo" />
                        <h1 className="text-3xl md:text-5xl font-salsa font-semibold">Banana</h1>
                    </div>
                    <h2 className="text-lg md:text-xl font-salsa">Opensource Web-based Web3 wallet</h2>
                </div>
                <div className="w-9/10 md:w-6/10 flex flex-col items-center justify-center gap-5">
                    <div className="w-full flex items-center justify-between">
                        <p className="font-sans text-lg md:text-xl text-center">Enter the Recovery Words </p>
                        <Button variant={"link"} onClick={() => {setScreen("12-words")}}>use 12 words?</Button>
                    </div>
                    <div className="w-full bg-black p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 rounded border shadow">
                        {
                            Array.from({ length: 24 }).map((_, i) => (
                                <Input
                                    value={words[i]}
                                    className="text-sm md:text-md"
                                    onChange={(e) => {
                                        setWords((prev) => {
                                            const part = [...prev];
                                            part[i] = e.target.value;
                                            return part
                                        })
                                    }}
                                    key={i}
                                />
                                // <WordBlock key={i} word="tornado" />
                            ))
                        }
                    </div>
                </div>
                <div className="w-9/10 md:w-9/10 flex justify-around items-center">
                    <Button variant={"secondary"} onClick={() => { setScreen("words") }}>Generate New Words</Button>
                    <Button size={"lg"} variant={"default"} disabled={!isValid} onClick={() => {setScreen("wallet")}}>Generate Wallet</Button>
                </div>
            </div>
        </div>
    </>)
}