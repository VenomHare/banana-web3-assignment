import { ScreenContext, Web3Context } from "@/context/context"
import { useContext, useMemo, useState } from "react"
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

export const TwelveWordsScreen = () => {
    const { setScreen } = useContext(ScreenContext);
    const web3 = useContext(Web3Context);
    const [words, setWords] = useState<string[]>(Array.from({ length: 12 }).map(() => ""));

    const isValid = useMemo(() => {
        return words.every((e) => {
            return e.trim() !== "" && e.trim().split(" ").length == 1
        })
    }, [words])

    return (<>
        <div className="h-dvh w-screen animate-popin">
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
                        <Button variant={"link"} onClick={() => { setScreen("24-words") }}>use 24 words?</Button>
                    </div>
                    <div className="w-full bg-black p-6 grid grid-cols-3 gap-5 rounded border shadow">
                        {
                            Array.from({ length: 12 }).map((_, i) => (
                                <Input
                                    value={words[i]}
                                    onChange={(e) => {
                                        setWords((prev) => {
                                            const part = [...prev];
                                            part[i] = e.target.value;
                                            return part
                                        })
                                    }}
                                    onPaste={(e) => {
                                        const data = e.clipboardData.getData("text").trim();
                                        if (data.split(" ").length == 12) {
                                            e.preventDefault();
                                            setWords(data.split(" "));
                                        }
                                        if (data.split("\n").length == 12) {
                                            e.preventDefault();
                                            setWords(data.split("\n").map(x=>x.trim()));
                                        }
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
                    <Button size={"lg"} variant={"default"} disabled={!isValid || !web3} onClick={() => {
                        web3?.createNewAccount(words).then(() => {
                            setScreen("wallet")
                        });
                    }}>Generate Wallet</Button>
                </div>
            </div>
        </div>
    </>)
}