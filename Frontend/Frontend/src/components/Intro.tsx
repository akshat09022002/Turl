import '../font.css'
import Typewriter from 'typewriter-effect'

const Intro = () => { 
    
    return <div className='text-white mx-2 sm:w-2/3 sm:mx-auto mt-32'>
    <div className='font-Roboto text-3xl  sm:text-5xl'>
    <Typewriter
        options={{
            delay: 100,
            cursor: '',
        }}
        onInit={(typewriter)=>{
            typewriter.typeString('Welcome to Turl')
            .start()
        }}
    />
    </div>
    
    <div className='font-Roboto text-[#b5aec7] text-base pt-7 h-[96px] sm:text-2xl  sm:pl-3 sm:h-32'>
    <Typewriter
        options={{
            strings: ["Effortlessly Shorten Your Links, Organize them into Secure, Password-Protected Pages, and Gain Insight with Advanced Performance Tracking."],
            autoStart: true,
            loop: true,
            cursor: '|',
            delay: 60,
            deleteSpeed: 60,
        }}
    />
    </div>
  </div>
}

export default Intro