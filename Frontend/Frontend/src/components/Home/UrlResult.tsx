import { FaCopy } from "react-icons/fa";
import { urlResult } from "../../store/atoms/atom";
import { useRecoilValue } from "recoil";

const UrlResult = () => {

    const isPresent = useRecoilValue(urlResult);
  
    if(isPresent==""){
        return <></>
    }
    else return <div className='flex flex-col items-center mx-auto mt-12'>
    <div className="w-2/3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h6 className="mb-2 text-2xl font-bold tracking-tight text-white">Here's your shortened URL:</h6>
      <div className="flex items-center justify-start ">
      <h3 id="copy" className="mb-3 font-normal text-gray-700 dark:text-gray-200">This is the url dkg';dkg ;odgk;sd kg;odk g;odsf g</h3>
      <button className="btn px-2 mb-3" title="copy to clipboard" data-clipboard-target="#copy"><FaCopy  className="text-white"></FaCopy></button>
      </div>
  
</div>
</div>
}

export default UrlResult;