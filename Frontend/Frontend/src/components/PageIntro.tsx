import pages from "../pages/pictures/pages.jpeg"
import { motion } from "framer-motion"
import '../font.css'

const PageIntro = () => {
    return <div className="text-white max-w-[1478px] flex-col justify-center mx-auto mt-32">
        <div className="flex flex-row w-full">
        <motion.div  initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 2 }}
                className="w-3/5 flex flex-col items-center">
                <div>
                <h1 className="text-2xl font-Roboto mb-12">Create URL Pages</h1>
                <ul className="list-disc font-Roboto list-inside  text-lg">
                <li>Effortlessly organize your URLs in one convenient location</li>
    <li>Safeguard your page with robust password protection</li>
    <li>Enjoy seamless access to your page from anywhere using the URL</li>
    <li>Easily share your curated page with friends</li>
    <li>Store up to 50 URLs on each meticulously crafted page</li>
                </ul>
            </div>
            
            </motion.div>
        <motion.div  initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 2 }}
                className="w-2/5 flex justify-center"><img className="max-w-60 w-1/2 rounded-lg" src={pages} /></motion.div>

        
                    </div>
    </div>
}

export default PageIntro;