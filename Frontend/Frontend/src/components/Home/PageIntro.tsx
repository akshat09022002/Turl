import pages from "../../pages/pictures/pages.jpeg";
import { motion } from "framer-motion";
import "../../font.css";

const PageIntro = () => {
  return (
    <div className="text-white max-w-[1478px] flex-col justify-center mx-auto mt-14 sm:mt-32">
      <div className="flex flex-row w-full">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 2 }}
          className="w-3/5 flex flex-col items-center ml-2 sm:ml-12 md:ml-16"
        >
          <h1 className="font-semibold  text-lg  mb-8 sm:text-2xl  sm:mb-12">
            Create URL Pages
          </h1>
          <ul className="list-disc font-Roboto text-xs list text-start pl-2 sm:text-lg md:text-xl">
            <li className="py-1">
              Effortlessly organize your URLs in one convenient location
            </li>
            <li className="py-1">
              Safeguard your page with robust password protection
            </li>
            <li className="py-1">
              Enjoy seamless access to your page from anywhere using the URL
            </li>
            <li className="py-1">
              Easily share your curated page with friends
            </li>
            <li className="py-1">
              Store up to 50 URLs on each meticulously crafted page
            </li>
          </ul>
        </motion.div>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 2 }}
          className="w-2/5 flex justify-center items-center ml-8"
        >
          <img
            className="max-w-60 rounded-lg w-[110px] h-[110px] sm:w-[200px] sm:h-[200px]  md:w-[250px] md:h-[250px]"
            src={pages}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default PageIntro;
