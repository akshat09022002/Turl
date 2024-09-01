import { useSetRecoilState } from "recoil";
import { signinpop } from "../../store/atoms/atom";
import { IoClose } from "react-icons/io5";

function Signin() {
  const updatesingin = useSetRecoilState(signinpop);

  return (
    <div className="fixed inset-0 flex justify-center items-center text-red-400 bg-opacity-30 backdrop-blur-sm">
      <div className="max-w-[363px] max-h-[440px] rounded-3xl bg-[#3e1f9c] items-center  h-1/2 w-5/6 sm:w-2/3">
        <div className="h-full grid grid-rows-4 px-6">
          <div className="flex justify-end row-span-1  pt-4">
            <button
              className="text-[#c70074] text-2xl sm:text-3xl"
              onClick={() => updatesingin(false)}
            >
              <IoClose />
            </button>
          </div>
          <div className="row-span-3 flex flex-col justify-center h-3/4">
            <form className="max-w-sm mx-auto w-full">
              <div className="mb-5 ">
                <label className="block mb-2 text-md font-medium text-[#c70074] ">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="placeholder-black bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 opacity-60"
                  placeholder="name@email.xyz"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-md font-medium text-[#c70074]">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="eg. abcd"
                  id="password"
                  className="placeholder-black bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5  opacity-60"
                  required
                />
              </div>
              <button
                type="submit"
                className="text-white bg-[#c70074] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-4 py-2"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
