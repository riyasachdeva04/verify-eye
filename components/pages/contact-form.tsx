"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const formSchema = z.object({
  dropdown: z.string().min(1, {
    message: "Dropdown selection is required",
  }),
  textInput: z.string().min(1, {
    message: "Text input is required",
  }),
  urlInput: z.string().url({
    message: "Invalid URL",
  }),
});

export default function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dropdown: "",
      textInput: "",
      urlInput: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission
    console.log(values);
    form.reset();
  }

  const dropdownOptions = [
    { value: "Lex", label: "Lex Friedman" },
    { value: "Joe", label: "Joe Rogan" },
    { value: "Huberman", label: "Andrew Huberman" },
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4 py-8 sm:w-[24rem]"
      >
        <FormField
          control={form.control}
          name="dropdown"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Host Name </FormLabel>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button>{field.value ? field.value : "Select an option"}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {dropdownOptions.map((option) => (
                      <DropdownMenuItem key={option.value} {...field}>{option.label}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="textInput"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Speaker</FormLabel>
              <FormControl>
                <Input placeholder="Enter text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="urlInput"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Shorts/Reels URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
