import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "flowbite-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "../ui/spinner";

const formSchema = z.object({
  newPassword: z.string().min(5, {
    message: "Password must have atleast 5 characters",
  }),
  currentPassword: z.string().min(5, {
    message: "Password must have atleast 5 characters",
  }),
  confirmPassword: z.string().min(5, {
    message: "Password must have atleast 5 characters",
  }),
});

const ChangePassword = ({
  setOpenDialog,
}: {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      if (values.newPassword !== values.confirmPassword)
        return toast({
          title: "Passwords do not match",
        });

      if (values.newPassword === values.currentPassword) {
        return toast({
          title: "New password cannot be same as current password",
        });
      }
      await axios
        .post<{ msg: string }>(
          `${import.meta.env.VITE_BACKEND_API}/user/updatePassword`,
          {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          toast({
            title: response.data.msg,
          });
          setOpenDialog(false);
        });
    } catch (err: any) {
      toast({
        title: err.response.data.msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>
                  <div className="w-full text-start pl-2 text-sm">
                    Current Password
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="mt-2"
                    placeholder="Enter current password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>
                  <div className="w-full text-start pl-2 text-sm">
                    New Password
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="mt-2"
                    placeholder="Enter new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>
                  <div className="w-full text-start pl-2 text-sm">
                    Confirm Password
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="mt-2 "
                    placeholder="Confirm new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {loading ? (
            <div className="w-1/5">
              <Spinner size="medium" className="mt-4 text-[#cc1b6c]" />
            </div>
          ) : (
            <Button
              className="mt-4 bg-[#cc1b6c] hover:bg-blue-800 font-semibold"
              type="submit"
            >
              Submit
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ChangePassword;
