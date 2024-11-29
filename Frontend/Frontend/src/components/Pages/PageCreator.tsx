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

const FormSchema = z.object({
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
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
  password: z
    .string()
    .min(5, {
      message: "password should have min 5 characters",
    })
    .optional()
    .or(z.literal("")),
  urlPrefix: z.string().optional(),
});

const PageCreator = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
      urlPrefix: "https://prefixURL/",
      customUID: "",
      password: "",
    },
  });

  const { toast } = useToast();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Form submitted:", data);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <>
      <div className="w-full flex justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg p-6 mt-16 mx-2 sm:mx-32 md:mx-48  max-w-[850px]"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-md  sm:text-lg md:text-2xl font-semibold h-fit">
                    Create New Page
                  </FormLabel>
                  <FormControl className="mt-4">
                    <Input
                      placeholder="What this page is about?"
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
                        <Input
                          placeholder="Enter a custom UID (optional)"
                          className="bg-white text-black p-4 md:p-6 text-sm sm:text-base md:text-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="mt-4">
                    <Input
                      type="password"
                      placeholder="Enter a password (optional)"
                      className="bg-white text-black p-4 md:p-6 mt-4 text-sm sm:text-base md:text-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormDescription className="text-[#cc1b6c] mt-2 mb-2 text-sm md:text-base">
              *If no custom UID is provided, an automated UID will be assigned.
            </FormDescription>
            <Button
              className="mt-2 bg-white hover:bg-gray-300 text-black text-sm sm:text-base md:text-lg md:h-12 md:w-18"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default PageCreator;
