import { cn, truncateKey } from '@/lib/utils';
import { Copy } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

const CopyKeyBlock = ({ value, display }: { value: string, display?: boolean }) => {
    const copyPublicKey = () => {
        const item = new ClipboardItem({ "text/plain": new Blob([value], { type: "text/plain" }) });
        navigator.clipboard.write([item]);
    }
    return (<>
        <div className={cn(
            "w-full flex ",
            display ? "justify-start mt-2 mb-5" : "justify-end my-5"
        )}>
            <div className="flex p-2 justify-between items-center gap-2 bg-secondary rounded border border-border/40">
                <p className={cn(
                    "h-full border-e pe-5 font-sans ",
                    display ? "text-md tracking-normal truncate break-all" : "text-md md:text-lg tracking-[.08em]"
                )} onCopy={(e) => {
                    e.preventDefault();
                    copyPublicKey();
                }}>
                    {
                        display ? <>
                            <span className='hidden md:inline'>{value}</span>
                            <span className='md:hidden'>{truncateKey(value)}</span>
                        </> 
                        : truncateKey(value)
                    }
                </p>
                <Copy className="size-4 md:size-5 h-full me-2 active:scale-[0.95]" onClick={() => {
                    copyPublicKey();
                    toast.success("Copied public key!");
                }} />
            </div>
        </div>
    </>)
}
export default CopyKeyBlock