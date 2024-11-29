import { useEffect, useState } from "react";
import { PlaceholdersAndVanishInput } from "../ui2/placeholders-and-vanish-input";
import UrlResult from "./UrlResult";

const GeneratorBar = () => {
  const [input, setInput] = useState<string>("");
  const [urlResult, setUrlResult] = useState("");

  useEffect(() => {}, [urlResult]);

  return (
    <>
      <div className="mt-20 sm:mt-24 ">
        <PlaceholdersAndVanishInput
          placeholders={["Enter a URL to shorten"]}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={() => {
            setUrlResult(input);
          }}
        ></PlaceholdersAndVanishInput>

        {urlResult != "" && (
          <UrlResult
            urlResult={urlResult}
            setUrlResult={setUrlResult}
          ></UrlResult>
        )}
      </div>
    </>
  );
};

export default GeneratorBar;
