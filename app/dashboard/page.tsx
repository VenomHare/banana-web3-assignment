"use client";
import { Buffer } from "buffer"
import BalanceDisplayCard from "@/components/DashboardBlocks/BalanceDisplayCard";
import CopyKeyBlock from "@/components/DashboardBlocks/CopyKeyBlock";
import { HeadingBlock } from "@/components/DashboardBlocks/HeadingBlock";
import InteractButtons from "@/components/DashboardBlocks/InteractButtons";
import Sidebar from "@/components/DashboardBlocks/Sidebar"
import { AccountsContext } from "@/context/context";
import { AccountStorage, KeySet } from "@/lib/types";
import { cn, scrollbar_class } from "@/lib/utils"
import { getLatestSolanaPrice, getSolanaBalance, getUSDCBalance, RpcId, sendSolana } from "@/lib/web3";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

const loadAccountsData = () => {
    try {
        const accountsStr = localStorage.getItem("accounts")
        const account: AccountStorage = JSON.parse(accountsStr!);
        return account ?? []
    }
    catch {
        localStorage.removeItem("accounts");
        return []
    }
}
const Dashboard = () => {
    const [activeAccount, setActiveAccount] = useState(0);
    const [accounts, setAccounts] = useState<AccountStorage>([]);
    const [latestSolValue, setLatestSolValue] = useState(NaN);
    const [rpcId, setRpcId] = useState<RpcId>("devnet");
    const [loadingBalance, setLoadingBalance] = useState(true);

    const [solValue, setSolValue] = useState(0);
    const [usdcValue, setUSDCValue] = useState(0);

    const router = useRouter();

    const updateAccounts = () => {
        const accounts = loadAccountsData();
        if (accounts.length == 0) {
            router.push("/create");
        }
        setAccounts(accounts);
    }

    const updateBalance = async () => {
        try {
            setLoadingBalance(true);
            if (accounts[activeAccount] && !accounts[activeAccount].publicKey) {
                return
            }
            await Promise.all([
                getSolanaBalance(rpcId, accounts[activeAccount].publicKey).then((val) => {
                    setSolValue(val);
                }),
                getUSDCBalance(rpcId, accounts[activeAccount].ATAs.usdc).then((val) => {
                    setUSDCValue(val);
                })
            ])
        }
        catch { }
        finally {
            setLoadingBalance(false);
        }
    }

    useEffect(() => {
        window.Buffer = Buffer;
    },[]) 

    useEffect(() => {
        updateAccounts();
        updateBalance();
        if (isNaN(latestSolValue)) {
            getLatestSolanaPrice().then(n => {
                if (n) {
                    setLatestSolValue(n);
                }
            })
        }
    }, []);
    useEffect(() => {
        updateBalance();
    }, [activeAccount, accounts]);
    
    return (<>
        <AccountsContext.Provider value={{ accounts, setAccounts, activeAccount, updateAccounts, updateBalance, rpcId }}>

            <div className="w-screen h-dvh overflow-x-hidden bg-background flex items-end justify-center">
                <div className={cn(
                    "w-full md:max-w-5xl shadow-4xl h-full md:h-auto md:min-h-[90dvh] md:rounded-2xl md:rounded-b-none transition-all duration-100",
                    "flex justify-between border border-border/40"
                )}>
                    <Sidebar activeAccount={activeAccount} setActiveAccount={setActiveAccount} />
                    <div className={cn(
                        "w-full md:rounded-tr-2xl bg-linear-to-br from-[#20212b] to-[#1e1e28] overflow-y-auto",
                        scrollbar_class
                    )}>
                        <div className="px-5 md:px-10">
                            <HeadingBlock
                                setRpcId={setRpcId}
                            />
                            <div className='block md:hidden w-fit px-4 rounded border border-green-500 bg-green-400/30 font-sans mt-2 capitalize'>
                                {rpcId}
                            </div>
                            <CopyKeyBlock value={accounts[activeAccount]?.publicKey ?? ""} />
                            <TotalAmountDisplay
                                amount={(solValue * latestSolValue) + (usdcValue * 0.9997)}
                                loading={loadingBalance}
                            />
                            <BalanceDisplayCard
                                image="/solana.png"
                                label="SOLANA"
                                USD_Value={solValue * latestSolValue}
                                token_Value={solValue}
                                token_code="SOL"
                                loading={loadingBalance}
                            />
                            <BalanceDisplayCard
                                image="/usdc.png"
                                label="USDC"
                                USD_Value={usdcValue * 0.9997}
                                token_Value={usdcValue}
                                token_code="USDC"
                                loading={loadingBalance}
                            />
                            <InteractButtons />

                        </div>
                    </div>
                </div>
            </div>
        </AccountsContext.Provider>
    </>
    )
}

const TotalAmountDisplay = ({ amount, loading }: { amount: number, loading: boolean }) => {
    return (<>
        <div className="w-full my-15 flex flex-col items-center justify-center">
            <p className="font-sans-serif text-accent-foreground/40">Available Balance</p>
            {
                loading ?
                    <div className="w-3/10 h-15 bg-primary/40 animate-pulse rounded"></div>
                    :
                    <p className="text-6xl font-salsa">${amount.toPrecision(4)}</p>
            }
        </div>
    </>)
}



export default Dashboard