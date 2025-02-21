import CustomizationIntro from "./CustomizationIntro";
import PageIntro from "./PageIntro";
import "../../font.css";
import { motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import { isSignedIn } from "@/store/atoms/atom";

const SignupBanner = () => {
  const isLoggedIn = useRecoilValue(isSignedIn);
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        className="w-full flex justify-center"
      >
        <h1 className="font-Roboto text-[#c70074] font-medium  mt-20 text-lg sm:mt-44 sm:text-3xl text-center">
          {isLoggedIn
            ? "Explore our exclusive features and enchance your experience."
            : "Sign up to unlock exclusive features"}
        </h1>
      </motion.div>
      <CustomizationIntro></CustomizationIntro>
      <PageIntro></PageIntro>
    </div>
  );
};

export default SignupBanner;
