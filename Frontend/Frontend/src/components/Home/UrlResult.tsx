import { SetStateAction, useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import ProgressBar from "./ProgressBar";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useDebounceValue } from "usehooks-ts";
import CustomTooltip from "../common/CustomTooltip";
import { Spinner } from "../ui/spinner";
import { isSignedIn } from "@/store/atoms/atom";
import { useRecoilValue } from "recoil";

const formSchema = z.object({
  initialUrl: z.string(),
  customUID: z
    .string()
    .min(1, {
      message: "customUID should have min 1 character",
    })
    .max(50, {
      message: "customUID should have max 50 characters",
    })
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Custom UID can only contain letters and numbers."
    ),
});

const UrlResult = ({
  urlResult,
  setUrlResult,
}: {
  urlResult: string;
  setUrlResult: React.Dispatch<SetStateAction<string>>;
}) => {
  const [pauseTimer, setPauseTimer] = useState(false);
  const loggedIn = useRecoilValue(isSignedIn);

  const handleFocus = () => {
    setPauseTimer((e) => {
      return !e;
    });
  };

  const CopyClick = () => {
    const textToCopy = document.getElementById("urlCopy") as HTMLInputElement;
    if (textToCopy && textToCopy.value) {
      navigator.clipboard
        .writeText(textToCopy.value)
        .then(() => {
          toast({
            title: "URL copied to clipboard",
          });
        })
        .catch(() => {
          toast({
            variant: "destructive",
            title: "Something went wrong",
          });
        });
    } else {
      toast({
        title: "No url to copy",
      });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialUrl: urlResult,
      customUID: "",
    },
  });

  const customUID = form.watch("customUID");
  const [debounceValue, debounceState] = useDebounceValue(customUID, 300);
  const [debounceLoader, setDebounceLoader] = useState(false);
  const [canAdd, setCanAdd] = useState(true);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!canAdd) {
      toast({
        title: "Custom UID is already taken",
      });
      return;
    }
    try {
      await axios
        .post<{ msg: string }>(
          `${import.meta.env.VITE_BACKEND_API}/customiseUrl`,
          {
            url: values.initialUrl,
            customUID: values.customUID,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          toast({
            title: response.data.msg,
          });
          const backend_api = import.meta.env.VITE_FRONTEND_API.split("/");
          const newUrl = `${backend_api[2]}/${values.customUID}`;
          setUrlResult(newUrl);
          debounceState("");
        });
    } catch (err: any) {
      toast({
        title: err.response.data.msg,
      });
    }
  }

  const { reset } = form;

  useEffect(() => {
    reset({ initialUrl: urlResult, customUID: "" });
  }, [urlResult]);

  useEffect(() => {
    if (!debounceValue) return;

    const fetchCustomUIDAvailability = async () => {
      setCanAdd(false);
      setDebounceLoader(true);
      try {
        const response = await axios.post<{ result: boolean }>(
          `${import.meta.env.VITE_BACKEND_API}/isValidUID/${debounceValue}`,
          {
            withCredentials: true,
          }
        );

        setCanAdd(response.data.result);
      } catch (error) {
        console.error("Error checking custom UID:", error);
      } finally {
        setDebounceLoader(false);
      }
    };
    fetchCustomUIDAvailability();
  }, [debounceValue]);

  return (
    <>
      <div className="flex flex-col items-center w-full mt-12 ">
        <div className="w-5/6 sm:w-2/3 p-6 bg-[#3a1d87] rounded-md shadow-2xl bg-[#3a1d87] max-w-[800px] relative">
          <ProgressBar
            pauseTimer={pauseTimer}
            setState={setUrlResult}
            urlResult={urlResult}
          ></ProgressBar>
          <div className="mb-4 text-[#cc1b6c] font-bold tracking-tight text-sm  sm:text-base md:text-lg">
            Shortened URL:
          </div>

          <Form {...form}>
            <form
              className="w-full"
              onSubmit={(e) => {
                if (!canAdd || !loggedIn) {
                  e.preventDefault();
                  return;
                }
                form.handleSubmit(onSubmit)(e);
              }}
            >
              <div className="flex w-full gap-2">
                <FormField
                  control={form.control}
                  name="initialUrl"
                  render={({ field }) => {
                    return (
                      <FormItem className="mb-2 sm:mb-4 w-full sm:w-3/4">
                        <FormControl>
                          <Input
                            id="urlCopy"
                            className="bg-white text-black text-xs sm:text-sm md:text-base p-2 "
                            disabled
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    );
                  }}
                />
                <Button
                  id="urlCopyButton"
                  type="button"
                  className=" bg-transparent hover:bg-trasparent"
                  onClick={CopyClick}
                >
                  <FaCopy className="text-white"></FaCopy>
                </Button>
              </div>
              <FormField
                control={form.control}
                name="customUID"
                render={({ field }) => (
                  <FormItem className="mb-4 sm:w-3/4">
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="bg-white text-black text-xs sm:text-sm md:text-base p-2 pr-8"
                          placeholder="Enter a custom UID"
                          disabled={!loggedIn}
                          onFocus={handleFocus}
                          {...field}
                          onBlur={handleFocus}
                        />
                        {debounceLoader && (
                          <Spinner
                            className="absolute right-1 top-1.5 text-[#3a1d87]"
                            size="small"
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs mt-2" />
                  </FormItem>
                )}
              />
              <FormDescription className="text-white mb-4 text-[12px] md:text-xs">
                *You can always access your URLs in the "My URLs" section of the
                menu.
              </FormDescription>
              <CustomTooltip
                message={
                  loggedIn
                    ? canAdd
                      ? "Customise URL"
                      : "UID is already taken"
                    : "Please login to customise URL"
                }
              >
                <Button
                  type="submit"
                  disabled={!loggedIn || !canAdd}
                  className="bg-[#cc1b6c] text-white text-sm sm:text-base md:p-6 hover:bg-blue-500"
                >
                  Customise
                </Button>
              </CustomTooltip>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UrlResult;
