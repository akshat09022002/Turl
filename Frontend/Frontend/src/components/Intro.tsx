import Typewriter from 'typewriter-effect'

const Intro = () => { 
    
    return <div className='text-white font-Roboto text-5xl w-2/3 mx-auto mt-32'>
    <div>
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
    
    <div className='text-[#b5aec7] text-2xl pt-7 pl-3 h-32'>
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