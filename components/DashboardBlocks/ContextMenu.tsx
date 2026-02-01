import React from 'react'
import { Button } from '../ui/button'
import { RpcId } from '@/lib/web3'
import { ArrowRightLeft, BookKey, FileKey } from 'lucide-react'

interface ContextMenuProps {
    onPrivateKeyClick: () => void
    onRecoveryClick: () => void
    onSwapClick: () => void
    rpcId: RpcId
}

const ContextMenu = ({ onPrivateKeyClick, onRecoveryClick, onSwapClick, rpcId }: ContextMenuProps) => {
    return (
        <>
            <div className="absolute top-full right-0 p-2 rounded rounded-tr-[1px] shadow border border-border/10 bg-secondary">
                <Button variant={'ghost'} className="w-full font-sans justify-start" onClick={onPrivateKeyClick}>
                    <FileKey />View Private Key
                </Button>
                <Button variant={'ghost'} className="w-full font-sans justify-start" onClick={onRecoveryClick}>
                    <BookKey /> View Recovery Phrases
                </Button>
                <Button variant={'ghost'} className="w-full font-sans justify-start" onClick={onSwapClick}>
                    <ArrowRightLeft /> Switch to {rpcId == "devnet" ? "testnet" : "devnet"}
                </Button>
            </div>
        </>
    )
}

export default ContextMenu