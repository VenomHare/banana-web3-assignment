import { cn } from '@/lib/utils'
interface BalanceDisplayCardProps {
    image: string,
    label: string,
    USD_Value: number,
    token_Value: number,
    token_code: string,

    loading: boolean
}
const BalanceDisplayCard = ({ image, label, USD_Value, token_Value, token_code, loading }: BalanceDisplayCardProps) => {
    return (
        <>
            <div className={cn(
                "w-full mt-5 mx-2 rounded shadow border border-border/50 p-3 bg-accent ",
                "flex flex-col md:flex-row md:items-center gap-4"
            )}>
                <div className="grow flex items-center gap-3">
                    <img src={image} alt={label} className="w-[50px] md:w-[80px]" />
                    <div className="grow">
                        <p className="text-xl md:text-2xl font-sans">{label}</p>
                    </div>
                </div>
                <div className="grow-0 shrink-0 mx-5 flex flex-col items-end">
                    {
                        loading ?
                            <p className="w-30 h-10 bg-primary/40 rounded animate-pulse"></p>
                            :
                            <p className="text-lg md:text-2xl font-sans">{token_Value} {token_code}</p>
                    }
                    {
                        loading ?
                            <p className="mt-1 w-20 h-6 bg-primary/40 rounded animate-pulse"></p>
                            :
                            <p className="text-md md:text-xl text-accent-foreground/50 font-sans">{USD_Value.toPrecision(5)} USD</p>
                    }
                </div>
            </div>
        </>
    )
}

export default BalanceDisplayCard