import CustomizationIntro from '../components/CustomizationIntro';
import PageIntro from '../components/PageIntro';
import '../font.css';
import { motion } from "framer-motion"

const SignupBanner = () => {
    return <div>
        <motion.div
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{
               duration: 0.8,
               delay: 0.5,
               ease: [0, 0.71, 0.2, 1.01]
             }}
            className='w-full flex justify-center'>
        <h1 className='mt-44 font-Roboto text-[#c70074] text-3xl font-medium'>Sign up to unlock exclusive features</h1>
        </motion.div>
        <CustomizationIntro></CustomizationIntro>
        <PageIntro></PageIntro>
    </div>
}

export default SignupBanner;