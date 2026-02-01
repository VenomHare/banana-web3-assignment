import { cn, truncateKey } from '@/lib/utils'
import React from 'react'
interface AccountBlockProps {
    index: number
    isActive?: boolean
    publicKey: string
    onClick?: () => void
}
const AccountBlock = ({ index, isActive, onClick, publicKey }: AccountBlockProps) => {
    return (
        <div className={cn(
            'md:w-4/5 px-4 py-2 rounded md:border border-border/40 md:shadow flex items-center gap-2 hover:cursor-pointer',
            isActive && 'border-primary/50',
        )}
            onClick={onClick}
        >
            <div className={cn(
                'w-[50px] h-[50px] md:w-[35px] md:h-[35px] rounded-full bg-accent-foreground/10 ',
                'flex items-center justify-center',
                'font-bold font-sans text-lg',
                isActive && 'bg-primary/50 ',
            )}>
                {index + 1}
            </div>
            <div className='hidden md:block'>
                <div className='text-lg font-sans'>
                    Account {index + 1}
                </div>
                <div className='text-xs text-primary/50'>
                    {truncateKey(publicKey, 4)}
                </div>
            </div>
        </div>
    )
}

export default AccountBlock