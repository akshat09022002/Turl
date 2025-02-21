"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { isSignedIn } from "@/store/atoms/atom";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const OtpInput = ({
  setIsOpenDialog,
  setSignupClose,
}: {
  setIsOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setSignupClose: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loading, setloading] = useState(false);
  const setLoggedIn = useSetRecoilState(isSignedIn);

  useEffect(() => {
    setloading(false);
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setloading(true);
    try {
      await axios
        .get<{ msg: string }>(
          `${import.meta.env.VITE_BACKEND_API}/user/verify-otp?otp=${Number(
            data.pin
          )}`,
          {
            withCredentials: true,
          }
        )
        .then((response: any) => {
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
          setIsOpenDialog(false);
          setSignupClose(false);
          setLoggedIn(true);
        });
    } catch (error: any) {
      toast({
        title: error.response.data.msg,
      });
    } finally {
      setloading(false);
    }
  }

  return (
    <div className="flex justify-center items-center p-12">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Verify Email</FormLabel>
                <FormControl>
                  <div className="mt-4">
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      {...field}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormMessage className="mt-2 text-xs" />
                <FormDescription className="mt-4 text-black">
                  *Otp sent to your email is only valid for 5 minutes.
                </FormDescription>
              </FormItem>
            )}
          />

          {loading ? (
            <Spinner className="text-black mt-4" />
          ) : (
            <Button className="mt-4" type="submit">
              Submit
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default OtpInput;
