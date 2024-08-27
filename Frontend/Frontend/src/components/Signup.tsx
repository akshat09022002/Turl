import { useSetRecoilState } from "recoil";
import { signuppop } from "../store/atoms/atom";
import { IoClose } from "react-icons/io5";

function Signup(){

    const updatesingup= useSetRecoilState(signuppop)

    return <div className="fixed inset-0 flex justify-center items-center text-red-400 bg-opacity-30 backdrop-blur-sm">
<div className="rounded-3xl bg-[#c70074]  items-center h-1/2 w-2/3">
<div className="flex justify-end pr-8 pt-8">
<button className="text-3xl text-[#3e1f9c]" onClick={()=>updatesingup(false)}><IoClose /></button>
</div>
<div className="mt-8">
<form className="max-w-sm mx-auto w-full">
  <div className="mb-5 w-full">
    <label className="block mb-2 text-md font-medium text-[#3e1f9c] ">First Name</label>
    <input type="first_name" id="first_name" className="placeholder-black bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 bg-black opacity-60" placeholder="John" required />
                    </div>
                    <div className="mb-5 w-full">
    <label className="block mb-2 text-md font-medium text-[#3e1f9c] ">Last Name</label>
    <input type="last_naem" id="last_name" className="placeholder-black bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 bg-black opacity-60" placeholder="Doe" required />
                    </div>
                    <div className="mb-5 w-full">
    <label className="block mb-2 text-md font-medium text-[#3e1f9c] ">Email</label>
    <input type="email" id="email" className="placeholder-black bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 bg-black opacity-60" placeholder="name@email.xyz" required />
  </div>
  <div className="mb-5">
    <label className="block mb-2 text-md font-medium text-[#3e1f9c]">Password</label>
    <input type="password" placeholder="eg. abcd" id="password" className="placeholder-black bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 bg-black opacity-60" required />
  </div>
  <button type="submit" className="text-white bg-[#3e1f9c] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-4 py-2">Submit</button>
</form>
</div>
</div>


    </div>
}

export default Signup;