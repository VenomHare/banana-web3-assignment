"use client";
import { generateAndSaveNewAccount } from '@/lib/web3';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import AccountBlock from './AccountBlock';
import { useContext } from 'react';
import { AccountsContext } from '@/context/context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn, scrollbar_class } from '@/lib/utils';

interface SidebarProps {
    activeAccount: number,
    setActiveAccount: (n: number) => void
}

const Sidebar = ({ activeAccount, setActiveAccount }: SidebarProps) => {
    const router = useRouter();
    const { accounts, updateAccounts, rpcId } = useContext(AccountsContext);
    return (
        <div className={cn(
            'w-1/5 md:w-4/10 min-w-[60px] md:rounded-tl-2xl bg-linear-to-br from-[#1f2029] to-[#1a1a23]',
            'border-r border-border/30',
            'flex flex-col pb-10 items-center'
        )}>
            <div className="w-full flex items-center justify-center mt-10 mb-2 gap-2 group">
                <img src="/banana.png" className="w-[35px] h-[35px] aspect-square object-contain group-hover:scale-[1.05] group-hover:rotate-10 transition-all duration-100" alt="Logo" />
                <h1 className="hidden md:block text-3xl font-salsa font-semibold">Banana</h1>
            </div>
            <h2 className="hidden md:block text-center text-lg font-sans">Web3 HD Wallet</h2>
            <div className='hidden md:block px-4 rounded border border-green-500 bg-green-400/30 font-sans mt-2 capitalize'>
                {rpcId}
            </div>
            <div className={cn(
                "grow max-h-[70dvh] w-full flex flex-col items-center md:gap-3 my-8 overflow-y-auto overflow-x-hidden",
                scrollbar_class
            )}>
                {
                    accounts.map((acc, i) => (
                        <AccountBlock
                            index={i}
                            key={i}
                            isActive={i == activeAccount}
                            onClick={() => {
                                if (activeAccount !== i) {
                                    setActiveAccount(i);
                                }
                            }}
                            publicKey={acc.publicKey}
                        />
                    ))
                }
            </div>
            <Button variant={'outline'} className='w-[50px] h-[50px] md:w-9/10 md:h-auto rounded-full md:rounded' onClick={async () => {
                const mnemonics = localStorage.getItem("mnemonic");
                if (!mnemonics) {
                    router.push("/create");
                    toast.error("Mnemonics not found");
                    return;
                }
                const status = await generateAndSaveNewAccount(mnemonics);  
                if (!status) {
                    toast.error("Failed to create Account. Try to recover or create new Wallet");
                }
                else {
                    updateAccounts();
                }
            }}>
                <Plus className='size-7 md:size-auto text-primary' />
                <span className='hidden md:block text-lg'>Add Account</span>
            </Button>
        </div>
    )
}

export default Sidebar