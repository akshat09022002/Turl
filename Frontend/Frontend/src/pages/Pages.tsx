import Navbar from "../components/Home/Navbar";
import Tablelist from "../components/Pages/Tablelist";


const Pages= ()=>{
    return(
        <div className="absolute inset-0 -z-10 min-h-screen h-fit w-full items-center px-5 pb-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
        
        <Navbar/>

        <Tablelist></Tablelist>

      </div>
    )
}

export default Pages;