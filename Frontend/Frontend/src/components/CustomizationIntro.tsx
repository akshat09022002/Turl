import { motion } from "framer-motion";
import customization from "../pages/pictures/customization.png";

const CustomizationIntro = () => {
  return (
    <div className="text-white max-w-[1478px] flex-col justify-center mx-auto mt-14 sm:mt-32">
      <div className="flex flex-row w-full">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 2 }}
          className="w-2/5 flex justify-center items-center mr-14 sm:mr-12"
        >
          <img
            className="max-w-60 bg-white rounded-lg w-[110px] h-[110px] sm:w-[200px] sm:h-[200px] md:h-[250px] md:w-[250px] "
            src={customization}
          />
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 2 }}
          className="w-3/5 flex flex-col items-center md:mr-12"
        >
          
            <h1 className="font-semibold mb-8 text-lg  sm:text-2xl  sm:mb-12 ">
              Customised URL's
            </h1>
            <ul className="list-disc font-Roboto text-xs pl-2 list text-start sm:text-lg md:text-xl">
              <li className="py-2">
                Take control of your URLs by selecting your preferred UID.
              </li>
              <li className="py-2">
                Enjoy a longer lifespan for your URLs — valid for up to two months
                instead of just one.
              </li>
              <li className="py-2">
                Effortlessly manage all your previously created URLs from a
                single, convenient location.
              </li>
            </ul>
          
        </motion.div>
      </div>
    </div>
  );
};

export default CustomizationIntro;
