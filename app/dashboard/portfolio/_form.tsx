"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updatePortfolioSchema } from "@/lib/validators";
import type { GetPortfolio } from "@/queries";
import { updatePortfolio } from "@/server/server-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconDeviceFloppy, IconLoader2 } from "@tabler/icons-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

export interface PortfolioFormProps {
  portfolio: NonNullable<GetPortfolio>;
}

export function PortfolioForm({ portfolio }: PortfolioFormProps) {
  const [pending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(updatePortfolioSchema),
    defaultValues: {
      name: portfolio.name ?? "",
      headline: portfolio.headline ?? "",
      subheading: portfolio.subheading ?? "",
      about: portfolio.about ?? "",
      slug: portfolio.slug ?? "",
      publicEmail: portfolio.publicEmail ?? "",
      socialLinks: {
        twitter: portfolio.socialLinks.twitter ?? "",
        github: portfolio.socialLinks.github ?? "",
        linkedin: portfolio.socialLinks.linkedin ?? "",
        website: portfolio.socialLinks.website ?? "",
      },
    },
  });

  const submit = form.handleSubmit(async (data) => {
    startTransition(async () => {
      await updatePortfolio(data);
    });
  }, console.error);

  return (
    <Form {...form}>
      <form onSubmit={submit}>
        <div className="flex flex-col gap-4 rounded-md bg-card/30 p-8 shadow-sm border border-muted">
          <Card>
            <CardHeader>
              <CardTitle>General Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publicEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Public Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="headline"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Headline</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subheading"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Subheading</FormLabel>
                      <FormControl>
                        <Textarea className="h-20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>About</FormLabel>
                      <FormControl>
                        <Textarea className="h-64" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <FormField
                  control={form.control}
                  name="socialLinks.github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Github</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socialLinks.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socialLinks.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socialLinks.website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <Button
            size="sm"
            className="self-end"
            type="submit"
            disabled={pending}
          >
            {pending ? (
              <IconLoader2 className="animate-spin mr-2 h-5 w-5" />
            ) : (
              <IconDeviceFloppy className="mr-2 h-5 w-5" />
            )}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
