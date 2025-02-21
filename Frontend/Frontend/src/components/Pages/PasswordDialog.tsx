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
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "flowbite-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "../ui/spinner";
import { useState } from "react";

const formSchema = z.object({
  newPassword: z
    .string()
    .min(5, {
      message: "Password must have atleast 5 characters",
    })
    .regex(/^[a-zA-Z0-9]+$/, "Custom UID can only contain letters and numbers.")
    .or(z.literal(""))
    .optional(),
});

const PasswordDialog = ({
  rowId,
  setOpenDialog,
}: {
  rowId: string;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await axios
        .post<{ msg: string }>(
          `${import.meta.env.VITE_BACKEND_API}/pages/updatePage`,
          {
            id: rowId,
            password: values.newPassword,
            description: undefined,
          },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          toast({
            title: "Password Updated",
            description: values.newPassword,
          });
          setOpenDialog(false);
        });
    } catch (err: any) {
      toast({
        title: err.response.data.msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    className="mt-2"
                    placeholder="Enter new password"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="mt-2">
                  <div className="w-full text-start">
                    *Leave blank to remove the password.
                  </div>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {isLoading ? (
            <div className="w-1/5">
              <Spinner size="medium" className="mt-4 text-[#cc1b6c]" />
            </div>
          ) : (
            <Button
              className="mt-4 bg-[#cc1b6c] hover:bg-blue-800] font-semibold"
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

export default PasswordDialog;
