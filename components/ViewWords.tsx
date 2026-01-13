import { X } from "lucide-react"
import { Button } from "./ui/button"

interface ViewWordsProps {
    setOpen: (e: boolean) => void
    open: boolean,
    words: string[]
}

export const ViewWords = ({ open, setOpen, words }: ViewWordsProps) => {
    if (!open) return (<></>)

    return (<>
        <div className="fixed top-0 left-0 z-100 w-screen h-dvh bg-black/50 flex items-center justify-center animate-popin-fast backdrop-blur-xl">
            <div className="max-w-3xl w-full bg-card border shadow rounded flex flex-col p-5 gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-sans text-2xl">Recovery Words</h3>
                    <Button variant={"ghost"} onClick={() => { setOpen(false) }}><X /></Button>
                </div>
                <div className="w-full grid grid-cols-3 gap-3">
                    {
                        words.map((word, i) => (<Button key={i} disabled variant={"outline"}>{word}</Button>))
                    }
                </div>
            </div>
        </div>
    </>)
}