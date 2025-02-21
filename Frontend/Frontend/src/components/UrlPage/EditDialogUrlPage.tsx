import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { rerenderPage } from "@/store/atoms/atom";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { z } from "zod";

const formSchema = z.object({
  newDescription: z.string().min(10, {
    message: "Description must have atleast 10 characters",
  }),
});

const EditDialogUrlPage = ({
  rowId,
  setOpenDialog,
}: {
  rowId: string;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const setrerender = useSetRecoilState(rerenderPage);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newDescription: "",
    },
  });

  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios
        .post<{ msg: string }>(
          `${import.meta.env.VITE_BACKEND_API}/updateUrl`,
          {
            id: rowId,
            description: values.newDescription,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          toast({
            title: response.data.msg,
          });
          setrerender((e) => e + 1);
        });
    } catch (err) {}
    setOpenDialog(false);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="newDescription"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>
                  <div className="w-full text-start pl-2 text-sm">
                    Description
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    className="mt-2"
                    placeholder="Add a description to this url"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-4 bg-[#cc1b6c] font-semibold" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditDialogUrlPage;
