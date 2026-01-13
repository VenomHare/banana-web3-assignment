import { useContext, useEffect, useState } from "react"
import { Button } from "./ui/button"
import { ScreenContext, Web3Context } from "@/context/context"

export const WordsScreen = () => {

    const { setScreen } = useContext(ScreenContext);
    const web3 = useContext(Web3Context);
    

    useEffect(() => {
        if (web3 && web3.words.length == 0) {
            web3.generateWords();
        }
    }, [web3])

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
                    <p className="font-sans text-lg md:text-xl text-center">Save the Recovery Words for Future </p>
                    <div className="w-full bg-black p-6 grid grid-cols-3 gap-5 rounded border shadow">
                        {
                            !web3 && <p>Loading...</p>
                        }
                        {
                            web3 && web3.words.map((word, i) => (
                                <Button variant={"outline"} key={i}>{word}</Button>
                            ))
                        }
                    </div>
                </div>
                <div className="w-9/10 md:w-9/10 flex justify-around items-center">
                    <Button variant={"secondary"} onClick={() => { setScreen("12-words") }}>Use Existing Words</Button>
                    <Button size={"lg"} variant={"default"} disabled={web3?.loading} onClick={() => {
                        web3?.createNewAccount().then(() => {
                            setScreen("wallet")
                        })
                    }}>Generate Wallet</Button>
                </div>
            </div>
        </div>

    </>)
}

