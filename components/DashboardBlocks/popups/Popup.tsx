import { PopupState } from "@/lib/types"
import { X } from "lucide-react"
import React from "react"
import { toast } from "sonner"
import CopyKeyBlock from "../CopyKeyBlock"

interface PopupProps {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    state?: PopupState
}

const Popup = ({ open, setOpen, state }: PopupProps) => {
    if (!open || !state) {
        return (<></>)
    }
    const copyWords = (data: string) => {
        const item = new ClipboardItem({ "text/plain": new Blob([data], { type: "text/plain" }) });
        navigator.clipboard.write([item]);
        toast.success("Copied all words!");
    }
    return (
        <div className="w-screen h-screen bg-background/40 backdrop-blur-2xl border border-border/50 fixed top-0 left-0 flex items-center justify-center">
            <div className="w-xl md:min-h-[50dvh] rounded shadow bg-linear-to-br from-[#1f2029] to-accent p-6">
                <div className="w-full flex items-center justify-between p-3">
                    <h3 className="text-2xl text-primary/90 font-sans font-semibold">
                        {
                            state.display == "words" ?
                                "Recovery Phrases"
                                : "Account " + (state.accountIndex+1).toString().padStart(2, '0')
                        }
                    </h3>
                    <X className="cursor-pointer" onClick={() => { setOpen(false) }} />
                </div>

                <h4 className="mt-8 text-center text-red-500 font-semibold font-sans">
                    Never share your recovery words or private key with anyone. Anyone with access can control your assets.
                </h4>
                {
                    state.display == "words" &&
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mt-10" onCopy={(e) => {
                        e.preventDefault();
                        copyWords(state.words.join(" "));
                    }}>
                        {
                            state.words.length > 0 &&
                            state.words.map((w, i) => <div key={i} className="flex gap-2 font-sans-serif shadow border border-border/30 rounded p-2">
                                <span unselectable="on" style={{ "WebkitUserSelect": "none" }} className="text-foreground/50" >{i + 1}.</span>
                                {w}
                            </div>)
                        }
                    </div>
                }
                {
                    state.display == "private_key" && 
                    <div className="w-full flex flex-col items-start justify-center 3 gap-5 mt-10 auto">
                        <div className="flex flex-col">
                            <p>Public Key</p>
                            <CopyKeyBlock value={state.publicKey} display/>
                        </div>
                        <div className="flex flex-col">
                            <p>Private Key</p>
                            <CopyKeyBlock value={state.privateKey} display/>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Popup