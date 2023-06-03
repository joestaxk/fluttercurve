export default function Withdrawal() {
  return (
    <div className="pl-5 mb-5">
      <h1 className="text-3xl mb-1 text-[#333]">Make Withdraw?</h1>
      <p className="mb-8 text-[#333333ca]">If you don&apos;t get recieve any funds after 24hrs make sure you contact our support team.</p>
      <div className="flex justify-start">
        <div className="w-[50%]">
          <form action="" method="post">
            <div className=" ">
              <div className="mb-4">
                <label className="mb-2 text-[#212121cc] font-medium text-lg">Enter Withdrawal Amount</label>
                <div className="border-[#ccc] border-[1px]  rounded-lg overflow-hidden">
                  <input
                    type="text"
                    className="p-4 w-full outline-none bg-transparent"
                    placeholder="You can't withdraw due to insufficient funds"
                    id="withdrawal"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 text-[#212121cc] font-medium text-lg">Choose Currency</label>
                <div className="border-[#ccc] border-[1px] rounded-lg ">
                  <select name="source" className="p-4 outline-none bg-transparent border-none w-full" required>
                    <option value="">-Payment Method-</option>
                    <option value="bitcoin">Bitcoin BTC</option>
                    <option value="ethereum_classic">Ethereum Classic ETC</option>
                    <option value="ethereum">Ethereum ETH</option>
                    <option value="litecoin">Litecoin LTC</option>
                    <option value="usdt">USDT USDT</option>
                    <option value="xrp">Ripple Coin XRP</option>
                    <option value="doge">Dogecoin DOGE</option>
                  </select>
                </div>
              </div>

              <div className="">
                <label className="mb-2 text-[#303030cc] font-medium text-lg">Withdrawal Details</label>
                <div className="relative border-[#ccc] border-[1px]  rounded-lg overflow-hidden">
                  <input
                    type="text"
                    className="p-4 w-full outline-none bg-transparent"
                    placeholder="Paste Wallet Address here!"
                    id="withdrawal"
                  />

                  <span className="absolute right-2 bottom-3 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg"  width="36" height="36" viewBox="0 0 36 36"><path fill="rgba(33, 33, 33, 0.8)" d="M30 12h-4v2h4v2h2v-2a2 2 0 0 0-2-2Z" className="clr-i-solid clr-i-solid-path-1"/><path fill="rgba(33, 33, 33, 0.8)" d="M30 18h2v6h-2z" className="clr-i-solid clr-i-solid-path-2"/><path fill="rgba(33, 33, 33, 0.8)" d="M30 30h-2v2h2a2 2 0 0 0 2-2v-4h-2Z" className="clr-i-solid clr-i-solid-path-3"/><rect width="20" height="20" x="4" y="4" fill="rgba(33, 33, 33, 0.8)" className="clr-i-solid clr-i-solid-path-4" rx="2" ry="2"/><path fill="rgba(33, 33, 33, 0.8)" d="M20 30h6v2h-6z" className="clr-i-solid clr-i-solid-path-5"/><path fill="rgba(33, 33, 33, 0.8)" d="M14 26h-2v4a2 2 0 0 0 2 2h4v-2h-4Z" className="clr-i-solid clr-i-solid-path-6"/><path fill="none" d="M0 0h36v36H0z"/></svg>
                  </span>
                </div>
              </div>

              
              <div className="mt-4">
                <button type="submit" className="px-3 flex items-center justify-center gap-2 bg-[#373cc1cc] hover:bg-[#373cc1a8] transition-all duration-300 py-4 rounded-lg font-bold text-[#fff] w-[250px]">
                  <span>
                    Withdraw
                  </span>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#fff" d="M22 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1ZM7 20v-2a2 2 0 0 1 2 2Zm10 0h-2a2 2 0 0 1 2-2Zm0-4a4 4 0 0 0-4 4h-2a4 4 0 0 0-4-4V8h10Zm4-6h-2V7a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3H3V4h18Zm-9 5a3 3 0 1 0-3-3a3 3 0 0 0 3 3Zm0-4a1 1 0 1 1-1 1a1 1 0 0 1 1-1Z"/></svg>
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
}
