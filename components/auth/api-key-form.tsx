"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useUser } from "@/lib/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const formSchema = z.object({
  apiKey: z.string().min(1, { message: "API key is required" }),
});

export function ApiKeyForm() {
  const { apiKey, setApiKey } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
    },
  });

  // Set the form value when apiKey changes
  useEffect(() => {
    if (apiKey) {
      form.setValue("apiKey", apiKey);
    }
  }, [apiKey, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await setApiKey(values.apiKey);
      toast.success("API key saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save API key");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Google AI API Key</CardTitle>
        <CardDescription>
          Enter your Google Gemini API key to enable AI features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Google Gemini API key" {...field} />
                  </FormControl>
                  <FormDescription>
                    <span className="block mb-2">To get your API key:</span>
                    <ol className="list-decimal pl-5 space-y-1 text-sm">
                      <li>Go to <a
                        href="https://aistudio.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline inline-flex items-center"
                      >
                        Google AI Studio <ExternalLink className="h-3 w-3 ml-1" />
                      </a></li>
                      <li>Sign in with your Google account</li>
                      <li>Click on "Get API key" in the top right</li>
                      <li>Create a new API key or use an existing one</li>
                      <li>Copy the API key and paste it above</li>
                    </ol>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save API Key"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-gray-500">
        Your API key is stored securely in your browser and is only used for AI features
      </CardFooter>
    </Card>
  );
} 