import { motion } from 'framer-motion'
import { useSetRecoilState } from 'recoil';
import { signinpop,signuppop } from '../store/atoms/atom';
import {  useTransform,useTime } from 'framer-motion'


const Navbar = () => {
    
  const updatesignin: any = useSetRecoilState(signinpop);
  const updatesignup: any = useSetRecoilState(signuppop);

    const time= useTime();
    
    const rotate= useTransform(
        time,
        [0,10000],
        [0,360],
        {clamp: false}
    )

    return   <div className="flex flex-row justify-between text-white my-5">
    <div className="flex flex-row text-white">
<motion.div className='bg-white rounded-lg w-10 h-10 ml-5' style={{rotate}}  />
        <motion.div initial={{ opacity: 0, scale: 0.5 }}
animate={{ opacity: 1, scale: 1 }}
transition={{
duration: 0.3,
ease: [0, 0.71, 0.2, 1.01],
scale: {
  type: "spring",
  damping: 5,
  stiffness: 100,
  restDelta: 0.001
}
}} className='text-white font-Robot ml-5 text-4xl'>Turl</motion.div>
</div>
<div className="w-1/3 flex flex-row justify-end">
<button
    onClick={()=>updatesignin(true)}
    className="text-white bottom-2.5 bg-[#3f2097] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-4 py-2 w-1/6"
  >
    Sign in
  </button>
  <button
    onClick={()=>updatesignup(true)}
    className="text-white bottom-2.5 bg-[#c70074] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-4 mx-4 py-2 w-1/6"
  >
    Sign up 
  </button>
</div>
    </div>
      
}

export default Navbar;