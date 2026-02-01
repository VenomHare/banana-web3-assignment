'use client';

import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    return (<>
        <div className="w-screen h-dvh overflow-x-hidden bg-background flex items-end justify-center">
            <div className="w-full md:max-w-xl overflow-y-auto md:overflow-y-clip shadow bg-linear-to-br from-[#1f2029] to-accent h-full md:h-auto md:min-h-[70dvh] pt-10 md:rounded-3xl md:rounded-b-none transition-all duration-100">
                <div className="w-full flex items-center justify-center mt-15 mb-5 gap-2 group">
                    <img src="/banana.png" className="w-[50px] h-[50px] aspect-square object-contain group-hover:scale-[1.05] group-hover:rotate-10 transition-all duration-100" alt="Logo" />
                    <h1 className="text-5xl font-salsa font-semibold">Banana</h1>
                </div>
                <h2 className="text-center text-lg font-sans">Web3 HD Wallet</h2>
                <div className="mt-20 w-full flex flex-col items-center gap-5">
                    <Button className="w-3/5" onClick={() => {router.push("/create")}}>
                        Create New Wallet
                    </Button>
                    <Button variant={"secondary"} className="w-3/5" onClick={() => {router.push("/dashboard")}}>
                        Dashboard
                        <SquareArrowOutUpRight />
                    </Button>
                </div>
            </div>
        </div>
    </>);
}
