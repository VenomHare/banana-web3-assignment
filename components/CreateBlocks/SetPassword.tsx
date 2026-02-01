import { FormEvent, useContext, useState } from "react"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { generateSalt } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ScreenContext } from "@/context/context";
import { generateAndSaveNewAccount } from "@/lib/web3";


const PasswordBlock = () => {
    const [password, setPassword] = useState("");
    const { setScreen } = useContext(ScreenContext);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (password.trim().length < 6) {
            toast.warning("Password too short");
            return;
        }
        if (password == "banana123") {
            toast("Wow, 'banana123'? Might as well hand your wallet to a monkey 🐒.");
            return
        }
        const salt = generateSalt();
        const hash = await crypto.subtle.digest("SHA-256", Buffer.from(password + salt));
        console.log(hash.toString());
        localStorage.setItem("metadata", JSON.stringify({
            pass_hash: Buffer.from(hash).toString("base64"),
            salt
        }));

        //generate Accounts and save them in localstorage
        const words = localStorage.getItem("mnemonic");
        if (!words) {
            setScreen("words");
            return
        }
        await generateAndSaveNewAccount(words);
        router.push("/dashboard");
    }
    return (
        <>
            <div className="w-full md:max-w-xl overflow-y-auto md:overflow-y-clip shadow bg-linear-to-br from-[#1f2029] to-accent h-full md:h-auto md:min-h-[80dvh] pt-10 md:rounded-3xl md:rounded-b-none transition-all duration-100">
                <div className="w-full flex items-center justify-center mt-15 mb-5 gap-2 group">
                    <img src="/banana.png" className="w-[50px] h-[50px] aspect-square object-contain group-hover:scale-[1.05] group-hover:rotate-10 transition-all duration-100" alt="Logo" />
                    <h1 className="text-5xl font-salsa font-semibold">Banana</h1>
                </div>
                <h2 className="text-center text-lg font-sans">Web3 HD Wallet</h2>
                <h3 className="text-center text-2xl font-sans mt-10">
                    Set a Strong Password
                </h3>
                <p className="w-3/5 mx-auto text-balance text-center text-lg text-primary/40 font-salsa mt-4">
                    Don't use “banana123” hackers love fruit too.
                </p>
                <form className="w-full flex flex-col items-center my-5" onSubmit={handleSubmit}>

                    <Input
                        className="w-2/5 text-center font-salsa"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" className="w-3/5 mx-auto mt-10">
                        Create Wallet
                        <ChevronRight />
                    </Button>
                </form>

            </div>
        </>
    )
}


export default PasswordBlock