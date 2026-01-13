import { useContext } from "react";
import { Button } from "./ui/button";
import { ScreenContext } from "@/context/context";

export const CreateScreen = () => {

  const { setScreen } = useContext(ScreenContext);

    return (<>
      <div className="h-dvh w-screen animate-popin">
        <div className="w-full max-w-7xl h-full mx-auto flex flex-col items-center justify-center gap-5 ">
            <div className="flex items-center">
              <img src="/banana.png" className="w-[50px] h-[50px] md:w-[75px] md:h-[75px] aspect-square object-contain" alt="Logo" />
              <h1 className="text-3xl md:text-5xl font-salsa font-semibold">Banana</h1>
            </div>
            <h2 className="text-xl font-salsa">Opensource Web-based Web3 wallet</h2>
            <Button className="w-4/10 md:w-2/10 py-6 mt-10 bg-primary/70 text-xl text-foreground" onClick={()=>{setScreen("words")}}>Create Wallet</Button>
        </div>
      </div>
    </>);
}
