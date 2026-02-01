import { Lock, LockKeyhole, X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { FormEvent, useContext, useRef, useState } from "react"
import { toast } from "sonner"
import { ScreenContext } from "@/context/context"

interface EnterPasswordProps {
    setOpen: (e: boolean) => void
    open: boolean,
    onApprove: () => void,
}

export const EnterPassword = ({ open, setOpen, onApprove }: EnterPasswordProps) => {
    if (!open) return (<></>)
    const { setScreen } = useContext(ScreenContext);
    const [processing, setProcessing] = useState(false);
    const [password, setPassword] = useState("");
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (password.trim().length < 6) {
            toast.warning("Password too short");
            return;
        }
        setProcessing(true);
        const metaDataStr = localStorage.getItem("metadata");
        try {
            const metadata = JSON.parse(metaDataStr!);
            if (!metadata.pass_hash || !metadata.salt) {
                throw new Error("password hash not found");
            }
            const hashBuffer = await crypto.subtle.digest("SHA-256", Buffer.from(password + metadata.salt))
            const hash = Buffer.from(hashBuffer).toString("base64");
            if (hash == metadata.pass_hash) {
                onApprove();
                setOpen(false);
                return
            }
            else {
                toast.error("Incorrect Password!");
                setPassword("");
            }
        }
        catch {
            setScreen("password");
        }
        finally {
            setProcessing(false);
        }
    }
    return (<>
        <div className="fixed top-0 left-0 z-100 w-screen h-dvh bg-black/50 flex items-center justify-center animate-popin-fast backdrop-blur-xl">
            <div className="max-w-lg w-full bg-card border shadow rounded flex flex-col p-5 gap-4">
                <form className="w-full max-w-7xl h-full mx-auto flex flex-col items-center justify-center gap-5" onSubmit={handleSubmit}>
                    <div className="flex items-center">
                        <img src="/banana.png" className="w-[50px] h-[50px] md:w-[75px] md:h-[75px] aspect-square object-contain" alt="Logo" />
                        <h1 className="text-3xl md:text-5xl font-salsa font-semibold">Banana</h1>
                    </div>
                    <h2 className="text-xl font-salsa">Opensource Web-based Web3 wallet</h2>
                    <div className="flex flex-col items-center mt-10 gap-3">
                        <h3 className="font-sans text-2xl text-primary">Enter your Password </h3>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="w-3/5 flex flex-col gap-2 items-center">
                        <Button className="py-6 w-full bg-primary/70 text-xl text-foreground" disabled={processing}>
                            <Lock />
                            Continue
                        </Button>
                        <Button variant={"outline"} type="button" onClick={() => {
                            setOpen(false);
                        }} className="py-3 w-full bg-primary/70 text-lg text-foreground" disabled={processing}>
                            Cancel
                        </Button>
                    </div>
                </form><div>

                </div>
            </div>
        </div>
    </>)
}