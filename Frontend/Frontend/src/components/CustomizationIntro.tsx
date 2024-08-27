import { motion } from 'framer-motion';
import customization from '../pages/pictures/customization.png'

const CustomizationIntro = () => {
    return <div className="text-white max-w-[1478px] flex-col justify-center mx-auto mt-32">
        <div className="flex flex-row w-full">
        <motion.div  initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 2 }}
                className="w-2/5 flex justify-center"><img className="max-w-60 w-1/2 bg-white rounded-lg" src={customization} /></motion.div>

        <motion.div  initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 2 }}
                className="w-3/5 flex flex-col items-center">
                <div>
                <h1 className="text-2xl font-Roboto mb-12">Customised URL's</h1>
                <ul className="list-disc list-inside  text-lg">
                <li>Take control of your URLs by selecting your preferred UID.</li>
    <li>Enjoy a longer lifespan for your URLs—valid for up to two months instead of just one.</li>
    <li>Effortlessly manage all your previously created URLs from a single, convenient location.</li>
   
                </ul>
            </div>
            
            </motion.div>
                    </div>
    </div>
}

export default CustomizationIntro;