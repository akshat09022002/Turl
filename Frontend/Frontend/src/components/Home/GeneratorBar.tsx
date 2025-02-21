import { useState } from "react";
import { PlaceholdersAndVanishInput } from "../ui2/placeholders-and-vanish-input";
import UrlResult from "./UrlResult";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

const GeneratorBar = () => {
  const [input, setInput] = useState<string>("");
  const [urlResult, setUrlResult] = useState("");

  const handleSubmit = async (input: string) => {
    try {
      await axios
        .post<{ short_url: string }>(
          `${import.meta.env.VITE_BACKEND_API}/generateUrl`,
          {
            url: input.split(" ").join(""),
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setUrlResult(response.data.short_url);
        });
    } catch (err: any) {
      toast({
        title: err.response.data.msg,
      });
    }
  };

  return (
    <>
      <div className="mt-20 sm:mt-24 ">
        <PlaceholdersAndVanishInput
          placeholders={["Enter a URL to shorten"]}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={async () => {
            await handleSubmit(input);
          }}
        ></PlaceholdersAndVanishInput>

        {urlResult !== "" && (
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
