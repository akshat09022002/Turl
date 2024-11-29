function Signin() {
  return (
    <div className="w-full h-full p-11 bg-[#3f2097] rounded-md">
      <form className="max-w-sm mx-auto w-full">
        <div className="mb-5 ">
          <label className="block mb-2 text-md font-medium text-[#c70074] ">
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
        <div className="mb-5">
          <label className="block mb-2 text-md font-medium text-[#c70074]">
            Password
          </label>
          <input
            type="password"
            placeholder="eg. abcd"
            id="password"
            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
            required
          />
        </div>
        <span className="flex flex-row justify-center w-full">
          <button
            type="submit"
            className="w-2/3 text-white bg-[#c70074] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-4 py-2"
          >
            Login
          </button>
        </span>
      </form>
    </div>
  );
}

export default Signin;
