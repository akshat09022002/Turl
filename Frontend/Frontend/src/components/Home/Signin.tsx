import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useSetRecoilState } from "recoil";
import { isSignedIn, rerender } from "@/store/atoms/atom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must have atleast 6 characters" }),
});

function Signin({
  setSigninClose,
}: {
  setSigninClose: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const setLoggedIn = useSetRecoilState(isSignedIn);
  const setrerenderValue = useSetRecoilState(rerender);

  const submitHandler = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await axios
        .post<{
          msg: string;
          firstName: string;
          lastName: string | null;
          email: string;
        }>(
          `${import.meta.env.VITE_BACKEND_API}/user/login`,
          {
            email: values.email,
            password: values.password,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          localStorage.setItem(
            "user",
            JSON.stringify({
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              email: response.data.email,
            })
          );
          toast({
            title: response.data.msg,
          });
          setSigninClose(false);
          setLoggedIn(true);
        });
    } catch (err: any) {
      toast({
        title: err.response.data.msg,
      });
    } finally {
      setrerenderValue((e) => e + 1);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="w-full h-full p-11 bg-[#3f2097] rounded-md">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitHandler)}
          className="max-w-sm mx-auto w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block mb-2 text-md font-medium text-[#c70074]">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
                    placeholder="name@email.xyz"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block mb-2 text-md font-medium mt-5 text-[#c70074]">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="eg. abcd"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <span className="flex flex-row justify-center w-full mt-5">
            {loading ? (
              <Spinner className="text-[#cc1b6c]" />
            ) : (
              <button
                type="submit"
                className="w-2/3 text-white bg-[#c70074] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-4 py-2"
              >
                Login
              </button>
            )}
          </span>
        </form>
      </Form>
    </div>
  );
}

export default Signin;
