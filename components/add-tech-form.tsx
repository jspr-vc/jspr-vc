import "@uploadthing/react/styles.css";
import type { UploadRouter } from "@/app/api/uploadthing/core";
import { insertTechnologiesSchema } from "@/lib/validators";
import {
  type InsertTechnology,
  insertTechnology,
} from "@/server/server-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconDeviceFloppy, IconLoader2, IconTrash } from "@tabler/icons-react";
import { UploadDropzone } from "@uploadthing/react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface Props {
  onSuccess: (newTech: InsertTechnology) => void;
}

export function TechnologyAddForm({ onSuccess }: Props) {
  const [pending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(insertTechnologiesSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      icon: "",
    },
  });

  const icon = form.watch("icon");

  const submit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        const result = await insertTechnology(data);
        onSuccess(result);
      } catch (e) {
        console.error(e);
      }
    });
  }, console.error);

  return (
    <Form {...form}>
      <form onSubmit={submit}>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technology Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="NextJs..." />
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
                <FormLabel>Slug *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="nextjs" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="A React framework for the web..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={() => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-2 items-center ring-1 ring-muted p-8">
                    {icon && (
                      <div className="relative p-4 bg-card/30 rounded-md w-full">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => form.setValue("icon", "")}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                        <div
                          className="bg-contain w-full h-40 bg-center bg-no-repeat"
                          style={{ backgroundImage: `url("${icon}")` }}
                        />
                      </div>
                    )}
                    <UploadDropzone<UploadRouter>
                      endpoint="imageUploader"
                      onClientUploadComplete={(res = []) => {
                        const file = res.at(0);
                        if (file) {
                          form.setValue("icon", file.fileUrl);
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button>
            {pending ? (
              <IconLoader2 className="animate-spin mr-2 h-5 w-5" />
            ) : (
              <IconDeviceFloppy className="mr-2 h-5 w-5" />
            )}
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
}
