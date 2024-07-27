import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaLink } from'react-icons/fa'

const GeneratorBar = () => {

    const [isScaled, setIsScaled] = useState(false);

    return <motion.div
        whileHover={{
          scale: 1.2,
          transition: { duration: 1 },
        }}
        onTapStart={() => {setIsScaled(isScaled ? false : true),console.log("aah"+isScaled)}}
        style={{ scale: isScaled ? 1.2 : 1 }}
        className="w-2/3 mx-auto mt-20"
      >
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <FaLink className="text-white" />
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter a URL to shorten"
            required
           
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-[#c70074] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-4 py-2"
          >
            Generate
          </button>
        </div>
      </motion.div>
}

export default GeneratorBar;