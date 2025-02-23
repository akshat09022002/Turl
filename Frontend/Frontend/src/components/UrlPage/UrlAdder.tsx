"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { rerenderPage } from "@/store/atoms/atom";
import { useParams } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";
import { useEffect, useState } from "react";
import CustomTooltip from "../common/CustomTooltip";
import { Spinner } from "../ui/spinner";

const FRONTEND_API = import.meta.env.VITE_FRONTEND_API.split("/")[2];

const FormSchema = z.object({
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  url: z.string().url({
    message: "This field must be a url",
  }),
  customUID: z
    .string()
    .min(1, {
      message: "customUID should have min 1 character",
    })
    .max(50, {
      message: "customUID should have max 50 characters",
    })
    .regex(/^[a-zA-Z0-9]+$/, "Custom UID can only contain letters and numbers.")
    .optional()
    .or(z.literal("")),
  urlPrefix: z.string(),
});

const UrlAdder = () => {
  const setRerender = useSetRecoilState(rerenderPage);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
      urlPrefix: `${FRONTEND_API}/`,
      customUID: "",
      url: "",
    },
  });
  const customUID = form.watch("customUID");
  const [debounceValue, debounceState] = useDebounceValue(customUID, 300);
  const [debounceLoader, setDebounceLoader] = useState(false);
  const [canAdd, setCanAdd] = useState(true);
  const [loading, setLoading] = useState(false);
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

  const { toast } = useToast();

  const { id } = useParams();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    if (!canAdd) {
      toast({
        title: "Custom UID is already taken",
      });
      return;
    }
    try {
      await axios
        .post<{ msg: string }>(
          `${import.meta.env.VITE_BACKEND_API}/generateUrl`,
          {
            description: data.description,
            customised_url_name: data.customUID,
            url: data.url,
            pageUID: id,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          toast({
            title: response.data.msg,
          });
          setRerender((e) => e + 1);
        });
    } catch (err: any) {
      toast({
        title: err.response.data.msg,
      });
    } finally {
      form.reset();
      setCanAdd(true);
      debounceState("");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="w-full flex justify-center">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              if (!canAdd) {
                e.preventDefault();
                return;
              }
              form.handleSubmit(onSubmit)(e);
            }}
            className="rounded-lg p-6 mt-16 mx-2 sm:mx-32 md:mx-48  max-w-[850px]"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-md  sm:text-lg md:text-2xl font-semibold h-fit">
                    Add A URL
                  </FormLabel>
                  <FormControl className="mt-4">
                    <Input
                      placeholder="Add a description for this url"
                      className="bg-white text-black p-4 md:p-6 text-sm sm:text-base md:text-lg"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="mt-4">
                    <Input
                      placeholder="Enter the url"
                      className="bg-white text-black p-4 md:p-6 text-sm sm:text-base md:text-lg"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex grid grid-cols-10 gap-4">
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="urlPrefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="mt-4">
                        <Input
                          placeholder="https://prelink/"
                          disabled
                          className="bg-white text-black p-4 md:p-6 mt-4 text-sm sm:text-base md:text-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="customUID"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="mt-4">
                        <div className="relative">
                          <Input
                            placeholder="Enter a custom UID (optional)"
                            className="bg-white text-black p-4 pr-10  md:p-6 md:pr-10 text-sm sm:text-base md:text-lg"
                            {...field}
                          />
                          {debounceLoader && (
                            <Spinner
                              className="absolute right-1 top-2 md:top-3 text-[#3a1d87]"
                              size="small"
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormDescription className="text-[#cc1b6c] mt-2 mb-2 text-sm md:text-base">
              *If no custom UID is provided, an automated UID will be assigned.
            </FormDescription>
            <CustomTooltip
              message={
                loading
                  ? "Adding Url"
                  : canAdd
                  ? "Add Url"
                  : "UID is already taken"
              }
            >
              {loading ? (
                <Spinner size="medium" className="text-white" />
              ) : (
                <Button
                  disabled={canAdd ? false : true}
                  className={`mt-2 bg-white hover:bg-gray-300 text-black text-sm sm:text-base md:text-lg md:h-12 md:w-18 ${
                    canAdd ? "" : "cursor-not-allowed"
                  }`}
                  type="submit"
                >
                  Add
                </Button>
              )}
            </CustomTooltip>
          </form>
        </Form>
      </div>
    </>
  );
};

export default UrlAdder;
