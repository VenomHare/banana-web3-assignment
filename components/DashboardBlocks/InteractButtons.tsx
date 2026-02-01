import { createUSDC_SPL_ATA, sendSolana } from '@/lib/web3'
import { Button } from '../ui/button'
import { ArrowDown, ArrowRightLeft, ArrowUp, Copy } from 'lucide-react'
import { useContext, useEffect, useRef, useState } from 'react'
import { AccountsContext } from '@/context/context'
import QrCodeWithLogo from 'qrcode-with-logos'
import { toast } from 'sonner'
import SendPopupProps from './popups/SendPopup'

const InteractButtons = () => {

    const { accounts, activeAccount } = useContext(AccountsContext);
    const [receivePopup, setReceivePopup] = useState(false);
    const [SendPopup, setSendPopup] = useState(false);


    const image = useRef(null);
    const loadImage = () => {
        if (!image.current || !accounts[activeAccount] || !receivePopup) { return }
        new QrCodeWithLogo({
            content: accounts[activeAccount].publicKey,
            width: 200,
            canvas: image.current,
            cornersOptions: {
                type: "rounded",
                color: "#efba37"
            },
            dotsOptions: {
                type: "fluid",
                color: "#efba37"
            },
            nodeQrCodeOptions: {
                margin: 0,
                color: {
                    light: getComputedStyle(document.documentElement).getPropertyValue('--background') || "#ffffff"
                }
            }
        })
    }
    useEffect(loadImage, []);
    useEffect(() => {
        loadImage();
    }, [activeAccount, image.current, receivePopup])

    const copyKey = (data: string) => {
        const item = new ClipboardItem({ "text/plain": new Blob([data], { type: "text/plain" }) });
        navigator.clipboard.write([item]);
        toast.success("Copied Solana Address!");
    }

    return (
        <>
            {
                receivePopup &&
                <div className='w-screen h-screen fixed top-0 left-0 flex flex-col items-center justify-center bg-background/80 z-10'>
                    <div className='max-w-xl w-full min-h-[50dvh] rounded p-5 bg-linear-to-br from-[#1f2029] to-accent border flex flex-col gap-5 items-center'>
                        <h4 className='text-2xl md:text-4xl text-center font-sans'>Recieve Address</h4>
                        <canvas ref={image} className='bg-background rounded'></canvas>
                        <div className='flex flex-col gap-2 items-center p-3 rounded border'>
                            <p className='text-xl font-sans'>Your Solana Address</p>
                            <div className='h-px w-full bg-border'></div>
                            <p className="p-3 w-full text-center break-all">{accounts[activeAccount]?.publicKey}</p>
                            <Button variant={"outline"} onClick={() => {
                                copyKey(accounts[activeAccount]?.publicKey)
                            }}>Copy <Copy /></Button>
                        </div>
                        <Button variant={"secondary"} className='w-4/5 text-xl h-fit' onClick={() => { setReceivePopup(false) }}>
                            Close
                        </Button>
                    </div>
                </div>
            }
            <div className="w-full flex flex-col md:flex-row gap-4 my-10 px-2 " >
                <Button className="w-full h-fit md:w-1/2 text-xl md:text-3xl p-3" onClick={() => {
                    setSendPopup(true);
                }}>
                    <ArrowUp className="md:size-7" />
                    Send
                </Button>
                {/* <Button className="w-full h-fit md:w-1/3 text-xl md:text-3xl py-3" onClick={() => { createUSDC_SPL_ATA(accounts[activeAccount].publicKey) }}>
                    <ArrowRightLeft className="md:size-7" />
                    Swap
                </Button> */}
                <Button className="w-full h-fit md:w-1/2 text-xl md:text-3xl py-3" onClick={() => { setReceivePopup(true) }}>
                    <ArrowDown className="md:size-7" />
                    Recieve
                </Button>
            </div>

            <SendPopupProps 
                open={SendPopup}
                setOpen={setSendPopup}
            />
        </>
    )
}

export default InteractButtons