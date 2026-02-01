import { ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { useContext, useMemo, useState } from "react"
import { WordsBlockState } from "@/lib/types"
import { Input } from "../ui/input"
import { ScreenContext } from "@/context/context"

const Recover24Words = ({ setBlockState }: {
    setBlockState: (s: WordsBlockState) => void
}) => {
    const [words, setWords] = useState<string[]>(Array.from({ length: 24 }).map(() => ""));
    const { setScreen } = useContext(ScreenContext);

    const isValid = useMemo(() => {
        return words.every((e) => {
            return e.trim() !== "" && e.trim().split(" ").length == 1
        })
    }, [words])

    const saveMnemonic = () => {
        localStorage.setItem("mnemonic", words.join(" "))
    }

    return <>
        <h3 className="text-center text-2xl font-sans mt-10">Enter your Recovery Phrases</h3>
        <div
            className="text-primary hover:underline w-full text-center mt-2 cursor-pointer"
            onClick={() => { setBlockState("12-words") }}
        >
            Use 12 words
        </div>
        <div className="w-4/5 mx-auto grid grid-cols-2 sm:grid-cols-3 gap-5 mt-10">
            {
                words.map((w, i) => (
                    <div key={i} className="flex items-center gap-2 font-sans-serif shadow border border-border/30 rounded p-2">
                        <span unselectable="on" style={{ "WebkitUserSelect": "none" }} className="text-foreground/50" >{i + 1}.</span>
                        <Input
                            value={w}
                            onChange={(e) => {
                                setWords((prev) => {
                                    const arr = [...prev];
                                    arr[i] = e.target.value.trim();
                                    return arr
                                })
                            }}
                        />
                    </div>
                ))
            }
        </div>
        <div className="w-4/5 mx-auto my-10 flex flex-col md:flex-row gap-2">
            <Button variant={"outline"} className="w-full shrink" onClick={() => setBlockState("auto")}>
                Generate New words
            </Button>
            <Button className="w-full shrink" disabled={!isValid} onClick={() => {
                saveMnemonic();
                setScreen("password");
            }}>
                Continue
                <ChevronRight />
            </Button>
        </div>
    </>
}

export default Recover24Words;