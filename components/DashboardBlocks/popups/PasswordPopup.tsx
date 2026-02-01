import React, { FormEvent, useState } from "react"
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface PasswordPopupProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onApprove: () => void
}
const PasswordPopup = ({ open, setOpen, onApprove }: PasswordPopupProps) => {
    if (!open) {
        return (<></>)
    }


    const [password, setPassword] = useState("");
    const [closing, setClosing] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (password.trim().length < 6) {
            toast.warning("Password too short");
            return;
        }

        try {
            const metadataStr = localStorage.getItem("metadata");
            const metadata = JSON.parse(metadataStr!);
            if (!metadata.pass_hash || !metadata.salt) {
                throw new Error("Data not found");
            }
            const hash = await crypto.subtle.digest("SHA-256", Buffer.from(password + metadata.salt));
            const hashStr = Buffer.from(hash).toString("base64");
            if (metadata.pass_hash == hashStr) {
                onApprove();
                closePopup();
            }
            else {
                toast.error("Incorrect Password!");
            }
        }
        catch {
            router.push("/create");
            toast.error("Data not found!");
            return
        }
    }

    const closePopup = () => {
        setClosing(true);
        setTimeout(() => {
            setOpen(false);
        }, 800);
    }

    return (
        <>
            <div className="w-screen h-screen backdrop-blur-2xl fixed top-0 right-0 z-10 flex justify-center items-end">

                <div className={cn(
                    "w-full md:max-w-xl overflow-y-auto md:overflow-y-clip shadow h-full md:h-auto md:min-h-[80dvh] pt-10 md:rounded-3xl md:rounded-b-none ",
                    "bg-linear-to-br from-[#1f2029] to-accent transition-all duration-100 ",
                    closing ? "animate-popdown" : "animate-popup"
                )}>
                    <div className="w-full flex items-center justify-center mt-15 mb-5 gap-2 group">
                        <img src="/banana.png" className="w-[50px] h-[50px] aspect-square object-contain group-hover:scale-[1.05] group-hover:rotate-10 transition-all duration-100" alt="Logo" />
                        <h1 className="text-5xl font-salsa font-semibold">Banana</h1>
                    </div>
                    <h2 className="text-center text-lg font-sans">Web3 HD Wallet</h2>
                    <h3 className="text-center text-2xl font-sans mt-10">
                        Enter your Password
                    </h3>
                    <form className="w-full flex flex-col items-center my-5" onSubmit={handleSubmit}>
                        <Input
                            className="w-2/5 text-center font-salsa"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type="submit" className="w-3/5 mx-auto mt-10">
                            <Lock />
                            Verify
                        </Button>
                        <Button variant={"outline"} type="button" className="w-3/5 mx-auto mt-4" onClick={() => { closePopup() }}>
                            Cancel
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}


export default PasswordPopup