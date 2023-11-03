import { motion } from "framer-motion"
import CurrencyData from "./general/currency"
import CoinbaseApi from "./general/api"

export default function General() {

    return (
        <motion.div
           initial = {{opacity: 0}}
           animate = {{opacity: 1, transition: {delay: .2}}}
           exit={{transition: {delay: .5}, opacity: 0}}
        >
            <div className="w-full md:p-8 p-3">
                <div className="">
                    <h2 className="text-xl font-medium">General Setting</h2>
                    <p className="text-gray-600">Generally you can change things in the application.</p>
                </div>

                {/* update currency */}
                <CurrencyData />
                {/* Update coinbase API */}
                <CoinbaseApi />
            </div>
        </motion.div>
    )
}
