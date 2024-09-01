import { useSetRecoilState } from "recoil";
import { signuppop } from "../../store/atoms/atom";
import { IoClose } from "react-icons/io5";

function Signup() {
  const updatesingup = useSetRecoilState(signuppop);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-opacity-30 backdrop-blur-sm">
      <div className="bg-[#c70074] rounded-3xl w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 p-4 sm:p-8">
        <div className="flex justify-end">
          <button
            className="text-[#3e1f9c] text-xl sm:text-3xl"
            onClick={() => updatesingup(false)}
          >
            <IoClose />
          </button>
        </div>
        <form className="space-y-5">
          <div>
            <label className="block mb-2 text-md font-medium text-[#3e1f9c]">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
              placeholder="John"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-md font-medium text-[#3e1f9c]">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
              placeholder="Doe"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-md font-medium text-[#3e1f9c]">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
              placeholder="name@email.xyz"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-md font-medium text-[#3e1f9c]">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
              placeholder="eg. abcd"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-[#3e1f9c] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-4 py-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
