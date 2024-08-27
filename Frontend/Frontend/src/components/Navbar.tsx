import { motion } from "framer-motion";
import { useSetRecoilState } from "recoil";
import { signinpop, signuppop } from "../store/atoms/atom";
import { useTransform, useTime } from "framer-motion";

const Navbar = () => {
  const updatesignin: any = useSetRecoilState(signinpop);
  const updatesignup: any = useSetRecoilState(signuppop);

  const time = useTime();

  const rotate = useTransform(time, [0, 10000], [0, 360], { clamp: false });

  return (
    <div className="flex flex-row justify-between text-white my-5">
      <div className="flex flex-row text-white">
        <motion.div
          className="w-8 h-8 bg-white rounded-lg ml-5 sm:w-10 sm:h-10 "
          style={{ rotate }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
            scale: {
              type: "spring",
              damping: 5,
              stiffness: 100,
              restDelta: 0.001,
            },
          }}
          className="text-2xl sm: text-white font-Robot ml-5 text-4xl"
        >
          Turl
        </motion.div>
      </div>
      <div className="w-1/3 flex flex-row justify-end">
        <button
          onClick={() => updatesignin(true)}
          className="text-white bg-[#3f2097] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg p-2.5 sm:text-sm sm:px-4 sm:py-2 sm:w-1/6 sm:bottom-2.5"
        >
          Sign in
        </button>
        <button
          onClick={() => updatesignup(true)}
          className="hidden sm:block sm:text-white sm:bg-[#c70074] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg sm:bottom-2.5 sm:text-sm sm:px-4 sm:mx-4 sm:py-2 sm:w-1/6"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Navbar;
