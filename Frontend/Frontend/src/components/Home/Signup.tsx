import { useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import DialogWindowHome from "./DialogWindowHome";
import OtpInput from "./OtpInput";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

function Signup({
  setSignupClose,
}: {
  setSignupClose: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [customComponent, setCustomComponent] = useState<React.ReactNode>(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const { firstName, lastName, email, password } = values;
    try {
      await axios
        .post<{
          msg: string;
          firstName: string;
          lastName: string | null;
          email: string;
        }>(
          `${import.meta.env.VITE_BACKEND_API}/user/signup`,
          {
            firstName,
            lastName,
            email,
            password,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          toast({
            title: response.data.msg,
          });
          setCustomComponent(
            <OtpInput
              setIsOpenDialog={setIsOpenDialog}
              setSignupClose={setSignupClose}
            />
          );
          setIsOpenDialog(true);
        });
    } catch (error: any) {
      toast({
        title: error.response.data.msg,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <DialogWindowHome isOpen={isOpenDialog} setIsOpen={setIsOpenDialog}>
        {customComponent}
      </DialogWindowHome>
      <div className="w-full h-full p-12 bg-[#cc1b6c] rounded-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-2 text-md font-medium text-[#3e1f9c]">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
                      placeholder="John"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[#0D47A1] mt-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-2 text-md font-medium text-[#3e1f9c]">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
                      placeholder="Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[#0D47A1] mt-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-2 text-md font-medium text-[#3e1f9c]">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
                      placeholder="name@email.xyz"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[#0D47A1] mt-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-2 text-md font-medium text-[#3e1f9c]">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg w-full p-2.5"
                      placeholder="eg. abcd"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[#0D47A1] mt-2" />
                </FormItem>
              )}
            />
            <span className="flex flex-row justify-center w-full">
              {loading ? (
                <Spinner className="text-[#3e1f9c]" />
              ) : (
                <button
                  type="submit"
                  className="w-2/3 align-center text-white bg-[#3e1f9c] hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-white font-medium rounded-lg text-sm px-4 py-2"
                >
                  Signup
                </button>
              )}
            </span>
          </form>
        </Form>
      </div>
    </>
  );
}

export default Signup;
