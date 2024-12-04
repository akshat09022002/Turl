import { motion } from "framer-motion";
import { useTransform, useTime } from "framer-motion";
import { DrawerMenu } from "./DrawerMenu";
import { useEffect, useState } from "react";
import Signin from "./Signin";
import Signup from "./Signup";
import DialogWindowHome from "./DialogWindowHome";
import { useRecoilState } from "recoil";
import { isSignedIn } from "@/store/atoms/atom";

const Navbar = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [customComponent, setCustomComponent] = useState<React.ReactNode>(null);

  const time = useTime();

  const rotate = useTransform(time, [0, 10000], [0, 360], { clamp: false });

  const [isLoggedIn, setLoggedIn] = useRecoilState(isSignedIn);

  useEffect(() => {
    console.log("setting");
    const userDetails = localStorage.getItem("user");
    if (userDetails) setLoggedIn(true);
    else setLoggedIn(false);
  }, [isLoggedIn]);

  return (
    <>
      <DialogWindowHome isOpen={isOpenDialog} setIsOpen={setIsOpenDialog}>
        {customComponent}
      </DialogWindowHome>
      <div className="flex flex-row justify-between text-white my-5">
        <div className="flex flex-row text-white">
          <motion.div
            className="w-8 h-8 mt-2 bg-white rounded-lg ml-5 sm:w-10 sm:h-10 "
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
            className="text-3xl font-Robot pt-2 ml-4 sm:text-white sm:ml-5 sm:text-4xl"
          >
            Turl
          </motion.div>
        </div>
        <div className="w-2/3 flex flex-row justify-end">
          {isLoggedIn ? null : (
            <>
              <button
                onClick={() => {
                  setIsOpenDialog(true);
                  setCustomComponent(
                    <Signin setSigninClose={setIsOpenDialog} />
                  );
                }}
                className="hidden sm:block text-white bg-[#3f2097] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg text-xs py-0.5 px-4 sm:text-sm sm:px-4 sm:py-2 sm:w-1/6 sm:bottom-2.5"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  setIsOpenDialog(true);
                  setCustomComponent(
                    <Signup setSignupClose={setIsOpenDialog} />
                  );
                }}
                className="hidden sm:block sm:text-white bg-[#c70074] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg sm:bottom-2.5 sm:text-sm sm:px-4 sm:mx-4 sm:py-2 sm:w-1/6"
              >
                Sign up
              </button>
            </>
          )}
          <button>
            <DrawerMenu></DrawerMenu>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
