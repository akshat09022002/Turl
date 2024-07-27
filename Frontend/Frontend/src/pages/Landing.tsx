
import UrlResult from '../components/UrlResult'
import Signin from '../components/Signin'
import Signup from '../components/Signup'
import Navbar from '../components/Navbar';
import Intro from '../components/Intro';

import '../font.css'
import { useRecoilValue } from 'recoil';
import { signinpop,signuppop }  from '../store/atoms/atom';
import GeneratorBar from '../components/GeneratorBar';


function Landing() {
  
  const signin = useRecoilValue(signinpop);
  const signup= useRecoilValue(signuppop);
  

    return <div>
      {signin && <Signin></Signin>}
      {signup && <Signup></Signup>}
      
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 pb-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
        
        <Navbar></Navbar>
        
        <Intro></Intro>
        
        <GeneratorBar></GeneratorBar>

        <UrlResult></UrlResult>

      </div>
    </div>
   
}

export default Landing;