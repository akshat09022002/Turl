import { useSetRecoilState } from "recoil";
import { signinpop } from "../store/atoms/atom";
import { IoClose } from "react-icons/io5";

function Signin(){

    const updatesingin= useSetRecoilState(signinpop)

    return <div className="fixed inset-0 flex justify-center items-center text-red-400 bg-opacity-30 backdrop-blur-sm">
<div></div>
<div className="rounded-3xl bg-[#3e1f9c] items-center h-1/2 w-2/3">
<div className="flex justify-end pr-8 pt-8">
<button className="text-3xl text-[#c70074]" onClick={()=>updatesingin(false)}><IoClose /></button>
</div>
<div className="mt-24">
<form className="max-w-sm mx-auto w-full">
  <div className="mb-5 w-full">
    <label className="block mb-2 text-md font-medium text-[#c70074] ">Email</label>
    <input type="email" id="email" className="placeholder-black bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 bg-black opacity-60" placeholder="name@email.xyz" required />
  </div>
  <div className="mb-5">
    <label className="block mb-2 text-md font-medium text-[#c70074]">Password</label>
    <input type="password" placeholder="eg. abcd" id="password" className="placeholder-black bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 bg-black opacity-60" required />
  </div>
  <button type="submit" className="text-white bg-[#c70074] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-4 py-2">Submit</button>
</form>
</div>
</div>


    </div>
}

export default Signin;