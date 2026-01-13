import { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button"
import { Copy, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { ViewWords } from "./ViewWords";
import { useWeb3 } from "./useWeb3";
import { Web3Context } from "@/context/context";
import { toast } from "sonner";

export const WalletScreen = () => {

    const [showSolPrivateKey, setShowSolPrivateKey] = useState(false);
    const [showEthPrivateKey, setShowEthPrivateKey] = useState(false);
    const [isWordsPopupOpen, setIsWordsPopupOpen] = useState(false);
    const web3 = useContext(Web3Context);
    const [selectedAccountIndex, setSelectedAccountIndex] = useState(0);

    return (<>
        <div className="h-dvh w-screen animate-popin">
            <div className="w-full max-w-7xl h-full mx-auto flex flex-col px-4">
                <div className="w-full mt-30 flex flex-col justify-around">
                    <div className="flex items-center">
                        <img src="/banana.png" className="w-[50px] h-[50px] md:w-[75px] md:h-[75px] aspect-square object-contain" alt="Logo" />
                        <h1 className="text-3xl md:text-5xl font-salsa font-semibold">Banana</h1>
                    </div>
                    <h2 className="text-xl font-salsa">Opensource Web-based Web3 wallet</h2>
                </div>
                <div className="w-full max-h-full overflow-y-auto flex flex-col-reverse md:flex-row md:justify-between mt-[10dvh] gap-10">
                    <div className="w-full md:w-1/3 flex flex-col pt-20 md:pt-0">
                        <h3 className="text-3xl font-sans">Available Accounts</h3>
                        <div className="flex-1 w-full overflow-y-auto max-h-[40dvh] my-5 h-full">
                            {
                                web3 && web3.accounts.map((_, i) =>
                                    <AccountBlock
                                        index={i + 1}
                                        key={i}
                                        isActive={selectedAccountIndex == i}
                                        onClick={() => {
                                            setSelectedAccountIndex(i)
                                        }}
                                    />)
                            }
                        </div>
                        <div className="flex flex-col gap-4">
                            <Button className="bg-white text-black py-2" onClick={async () => {
                                await web3?.createNewAccount()
                            }}>Create New Account</Button>
                            <Button variant={"ghost"} className="py-2" onClick={() => { setIsWordsPopupOpen(true) }}>View Recovery Words</Button>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 h-full flex flex-col gap-5">
                        <h3 className="text-3xl font-sans text-primary">Account {selectedAccountIndex + 1}</h3>
                        <div className="w-full md:w-4/5 bg-[#272211] rounded p-5">
                            <div className="flex gap-3">
                                <Solana_Logo />
                                <p className="text-3xl font-sans">Solana</p>
                            </div>
                            <div className="flex flex-col gap-3 pt-5 font-sans">
                                <div className="flex flex-col gap-3">
                                    <p className="text-lg">Public Key:</p>
                                    <div className="flex text-sm gap-2 p-2 rounded items-center bg-foreground/10" onClick={() => {
                                        const item = new ClipboardItem({ ["text/plain"]: web3?.accounts[selectedAccountIndex].solana.publicKey || "", })
                                        window.navigator.clipboard.write([item]);
                                        toast.success("Copied to Clipboard!")
                                    }}>
                                        <Copy className="size-4 shrink-0" />
                                        <span className="overflow-hidden wrap-break-word">{web3?.accounts[selectedAccountIndex].solana.publicKey}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <p className="text-lg">Private Key:</p>
                                    <div className="flex gap-2 p-1 rounded items-center bg-foreground/10" onClick={() => { setShowSolPrivateKey(prev => !prev) }}>
                                        {
                                            showSolPrivateKey ?
                                                <EyeOff className="size-4 shrink-0" />
                                                :
                                                <Eye className="size-4 shrink-0" />
                                        }
                                        <span className={cn("text-sm",showSolPrivateKey ? "overflow-hidden wrap-break-word py-1" : "blur overflow-hidden")}>
                                            {web3?.accounts[selectedAccountIndex].solana.privateKey}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-4/5 bg-[#272211] rounded p-5">
                            <div className="flex gap-3">
                                <Ethereum_Logo />
                                <p className="text-3xl font-sans">Ethereum</p>
                            </div>
                            <div className="flex flex-col gap-3 pt-5 font-sans">
                                <div className="flex flex-col gap-3">
                                    <p className="text-lg">Public Key:</p>
                                    <div className="flex text-sm gap-2 p-1 rounded items-center bg-foreground/10" onClick={() => {
                                        const item = new ClipboardItem({ ["text/plain"]: web3?.accounts[selectedAccountIndex].ethereum.publicKey || "", })
                                        window.navigator.clipboard.write([item]);
                                        toast.success("Copied to Clipboard!")
                                    }}>
                                        <Copy className="size-4" />
                                        <span className="overflow-hidden wrap-break-word">{web3?.accounts[selectedAccountIndex].ethereum.publicKey}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <p className="text-lg">Private Key:</p>
                                    <div className="flex gap-2 p-1 rounded items-center bg-foreground/10" onClick={() => { setShowEthPrivateKey(prev => !prev) }}>
                                        {
                                            showEthPrivateKey ?
                                                <EyeOff className="size-4 shrink-0" />
                                                :
                                                <Eye className="size-4 shrink-0" />
                                        }
                                        <span className={cn("text-sm", showEthPrivateKey ? "overflow-hidden wrap-break-word" : "blur overflow-hidden")}>
                                            {web3?.accounts[selectedAccountIndex].ethereum.privateKey}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <ViewWords
            open={isWordsPopupOpen}
            setOpen={setIsWordsPopupOpen}
            words={web3?.words || []}
        />
    </>)
}

const AccountBlock = ({ index, isActive, onClick }: { index: number, isActive: boolean; onClick: () => void }) => {
    return (<>
        <div className={cn("w-9/10 flex items-center gap-5 p-3 m-3 bg-primary/10 rounded", isActive && "border-2 border-primary")} onClick={onClick}>
            <div className="w-15 h-15 font-salsa text-3xl rounded-full bg-primary/50 flex items-center justify-center">
                A{index}
            </div>
            <p className="text-sans text-2xl ">Account {index}</p>
        </div>
    </>)
}

const Solana_Logo = () => {
    return (<>
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" height="35px" width="35px" xmlns="http://www.w3.org/2000/svg"><path d="m23.8764 18.0313-3.962 4.1393a.9201.9201 0 0 1-.306.2106.9407.9407 0 0 1-.367.0742H.4599a.4689.4689 0 0 1-.2522-.0733.4513.4513 0 0 1-.1696-.1962.4375.4375 0 0 1-.0314-.2545.4438.4438 0 0 1 .117-.2298l3.9649-4.1393a.92.92 0 0 1 .3052-.2102.9407.9407 0 0 1 .3658-.0746H23.54a.4692.4692 0 0 1 .2523.0734.4531.4531 0 0 1 .1697.196.438.438 0 0 1 .0313.2547.4442.4442 0 0 1-.1169.2297zm-3.962-8.3355a.9202.9202 0 0 0-.306-.2106.941.941 0 0 0-.367-.0742H.4599a.4687.4687 0 0 0-.2522.0734.4513.4513 0 0 0-.1696.1961.4376.4376 0 0 0-.0314.2546.444.444 0 0 0 .117.2297l3.9649 4.1394a.9204.9204 0 0 0 .3052.2102c.1154.049.24.0744.3658.0746H23.54a.469.469 0 0 0 .2523-.0734.453.453 0 0 0 .1697-.1961.4382.4382 0 0 0 .0313-.2546.4444.4444 0 0 0-.1169-.2297zM.46 6.7225h18.7815a.9411.9411 0 0 0 .367-.0742.9202.9202 0 0 0 .306-.2106l3.962-4.1394a.4442.4442 0 0 0 .117-.2297.4378.4378 0 0 0-.0314-.2546.453.453 0 0 0-.1697-.196.469.469 0 0 0-.2523-.0734H4.7596a.941.941 0 0 0-.3658.0745.9203.9203 0 0 0-.3052.2102L.1246 5.9687a.4438.4438 0 0 0-.1169.2295.4375.4375 0 0 0 .0312.2544.4512.4512 0 0 0 .1692.196.4689.4689 0 0 0 .2518.0739z"></path></svg>
    </>)
}


const Ethereum_Logo = () => {
    return (<>
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="35px" width="35px" xmlns="http://www.w3.org/2000/svg"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
    </>)
}

const truncateKey = (key: string) => {
    if (key.length < 36) {
        return key
    }

    return key.slice(0, 14) + "......" + key.slice(key.length - 16);
}