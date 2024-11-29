import '../font.css'
import Navbar from '../components/Home/Navbar';
import Intro from '../components/Home/Intro';
import GeneratorBar from '../components/Home/GeneratorBar';
import SignupBanner from '../components/Home/SignupBanner';



function Landing() {
  
 
    return <div>
     
      
      
      <div className="absolute inset-0 -z-10 min-h-screen h-fit w-full items-center px-5 pb-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
        
        <Navbar></Navbar>
        
        <Intro></Intro>
        
        <GeneratorBar ></GeneratorBar>

        {/* {urlResult!="" && <UrlResult></UrlResult>} */}

        <SignupBanner></SignupBanner>

      </div>
    </div>
   
}

export default Landing;