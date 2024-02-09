"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const formSchema = z.object({
    dropdown: z.string().min(1, {
        message: "Dropdown selection is required",
    }),
    textInput: z.string().min(1, {
        message: "Text input is required",
    }),
    podcastUrlInput: z.string().url({
        message: "Invalid URL",
    }),
    shortsUrlInput: z.string().url({
        message: "Invalid URL",
    }),
});
import axios from "axios";

export default function MyForm() {
    const [showUrlInput, setShowUrlInput] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dropdown: "",
            textInput: "",
            podcastUrlInput: "",
            shortsUrlInput: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const selectedOption = dropdownOptions.find(option => option.value === values.dropdown);
        const urlToSend = selectedOption ? selectedOption.url : values.podcastUrlInput;
        const reelsUrlToSend = values.shortsUrlInput;
        const speakerName = values.textInput;

        console.log('Podcast URL:', urlToSend);
        console.log('Reels URL:', reelsUrlToSend);

        axios.post("http://localhost:5001/", {
            url: urlToSend,
            reelsUrl: reelsUrlToSend,
            speakerName: speakerName,
        })
            .then(response => {
                console.log('Response:', response.data);
                form.reset();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const dropdownOptions = [
        { value: "Lex Fridman", label: "Lex Fridman", url: "https://www.youtube.com/@lexfridman" },
        { value: "Joe Rogan", label: "Joe Rogan", url: "https://www.youtube.com/@joerogan" },
        { value: "Andrew Huberman", label: "Andrew Huberman", url: "https://www.youtube.com/@hubermanlab" },
        { value: "Others", label: "Other (provide url below)", url: "" },
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
                                    <DropdownMenuItem
                                        key={option.value}
                                        onClick={() => {
                                            if (option.value === "Others") {
                                                setShowUrlInput(true);
                                            } else {
                                                setShowUrlInput(false);
                                                form.setValue("podcastUrlInput", "");
                                            }
                                            field.onChange(option.value);
                                        }}
                                    >
                                        {option.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {showUrlInput && (
                    <FormField
                        control={form.control}
                        name="podcastUrlInput"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Host's Youtube Podcast URL</FormLabel>
                                <FormControl>
                                    <Input required placeholder="https://www.youtube.com/@podcastLink" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                    control={form.control}
                    name="textInput"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter the Speaker Name</FormLabel>
                            <FormControl>
                                <Input required placeholder="Elon Musk" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="shortsUrlInput"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter Shorts/Reels URL</FormLabel>
                            <FormControl>
                                <Input required placeholder="https://www.instagram.com/reels/randomReel" {...field} />
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