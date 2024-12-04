import { useEffect, useState } from "react";
import { PlaceholdersAndVanishInput } from "../ui2/placeholders-and-vanish-input";
import UrlResult from "./UrlResult";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

const GeneratorBar = () => {
  const [input, setInput] = useState<string>("");
  const [urlResult, setUrlResult] = useState("");

  const handleSubmit = async () => {
    try {
      await axios
        .post<{ short_url: string }>(
          `${import.meta.env.VITE_BACKEND_API}/generateUrl`,
          {
            url: input,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(response.data);
          setUrlResult(response.data.short_url);
        });
    } catch (err: any) {
      console.log(err);
      toast({
        title: err.response.data.msg,
      });
    }
  };

  useEffect(() => {}, [urlResult]);

  return (
    <>
      <div className="mt-20 sm:mt-24 ">
        <PlaceholdersAndVanishInput
          placeholders={["Enter a URL to shorten"]}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={async () => {
            setUrlResult(input);
            await handleSubmit();
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
