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
import { toast } from "@/hooks/use-toast";
import { rerenderPage, urlsStateFamily } from "@/store/atoms/atom";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "flowbite-react";
import React from "react";
import { useForm } from "react-hook-form";
import {  useSetRecoilState } from "recoil";
import { z } from "zod";

const formSchema = z.object({
  Password: z.string().min(5, {
    message: "Password must have atleast 5 characters",
  }),
});

type urlType = {
  id: string;
  uid: string;
  pageId: string;
  description: string | null;
  userId: string | null;
  url: string;
  visitorCount: number;
  lastVisit: Date;
};

const ProvidePassword = ({
  setOpen,
  pageUID,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pageUID: string;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Password: "",
    },
  });

  const setUrls = useSetRecoilState(urlsStateFamily(pageUID));
  const rerender=useSetRecoilState(rerenderPage);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // to be implemented
    try {
      await axios
        .post<{ msg: string; urls: urlType[] }>(
          `${import.meta.env.VITE_BACKEND_API}/pages/geturls`,
          {
            password: values.Password,
            pageUID: pageUID,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(response.data.urls);
          console.log('inputData',values);
          setUrls(
            {
              urls: response.data.urls,
              password: values.Password
            }
          );
          setOpen(false);
        });
    } catch (err: any) {
      console.log(err.response.data);
      toast({
        title: "Error",
        description: err.response.data.msg,
      });
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="Password"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>
                  <div className="w-full text-start pl-2 text-sm">
                    Enter Password
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="mt-2"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="mt-2">
                  <div className="w-full text-start">
                    *This page is password protected.
                  </div>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="mt-4 bg-[#cc1b6c] hover:bg-blue-800] font-semibold"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProvidePassword;
