"use client";
import "@uploadthing/react/styles.css";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconCalendar,
  IconDeviceFloppy,
  IconLoader2,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { TechnologyAdd } from "@/components/add-tech-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { TypographyH4 } from "@/components/ui/typography";
import { env } from "@/env-client";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { insertProjectSchema } from "@/lib/validators";
import type { GetAllTech, GetProject } from "@/queries";
import { type InsertTechnology, upsertProject } from "@/server/server-actions";

interface Props {
  project?: GetProject;
  portfolioId: number;
  technologies: GetAllTech;
}

export function ProjectForm({ project, technologies, portfolioId }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const projectForm = useForm({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      id: project?.id,
      portfolioId,
      name: project?.name ?? "",
      shortDescription: project?.shortDescription ?? "",
      body: project?.body ?? "",
      slug: project?.slug ?? "",
      date: project?.date ?? new Date(),
      stack: project?.stack.map((projectTech) => projectTech.tech.id) ?? [],
      thumbnail: project?.thumbnail ?? "",
    },
  });

  const [projectId, slug, thumbnail] = projectForm.watch([
    "id",
    "slug",
    "thumbnail",
  ]);

  const submit = projectForm.handleSubmit(async (data) => {
    startTransition(async () => {
      const formData = { ...data, portfolioId };
      const newProject = await upsertProject(formData);
      if (!newProject) {
        return;
      }

      projectForm.reset({
        id: newProject.id,
        portfolioId,
        name: newProject?.name ?? "",
        shortDescription: newProject?.shortDescription ?? "",
        body: newProject?.body ?? "",
        slug: newProject?.slug ?? "",
        date: newProject?.date ?? new Date(),
        stack:
          newProject?.stack.map((projectTech) => projectTech.tech.id) ?? [],
        thumbnail: newProject?.thumbnail ?? "",
      });

      if (projectId !== newProject.id) {
        router.push(`/dashboard/projects/${newProject.id}/edit`);
      }
    });
  });

  const currentStack = projectForm
    .watch("stack")
    .reduce<Record<number, GetAllTech[number]>>((acc, curr) => {
      const tech = technologies[curr];
      if (!tech) return acc;
      Object.assign(acc, { [curr]: tech });
      return acc;
    }, {});

  const addTechToStack = (tech: InsertTechnology) => {
    if (currentStack[tech.id]) {
      const newStack = projectForm
        .getValues("stack")
        .filter((id) => id !== tech.id);
      projectForm.setValue("stack", newStack);
      return;
    }
    const index = projectForm.getValues("stack").length;
    projectForm.setValue(`stack.${index}`, tech.id);
    technologies[tech.id] = tech;
  };

  return (
    <Form {...projectForm}>
      <div className="flex flex-col gap-4">
        <form>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={projectForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={projectForm.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    {env.NEXT_PUBLIC_URL || "localhost"}/projects/
                    {slug || "project_slug_here"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={projectForm.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          variant={"outline"}
                          className={cn(
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      }
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                      <FormControl>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) =>
                            field.onChange(
                              date || projectForm.getValues("date"),
                            )
                          }
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          autoFocus
                        />
                      </FormControl>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={projectForm.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormDescription>
                    Markdown supported (no headings)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={projectForm.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea className="h-96" {...field} />
                  </FormControl>
                  <FormDescription>Markdown supported</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={projectForm.control}
              name="thumbnail"
              render={() => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2 items-center ring-1 ring-muted p-8">
                      {thumbnail && (
                        <div className="relative p-4 bg-card/30 rounded-md w-full">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() =>
                              projectForm.setValue("thumbnail", "")
                            }
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                          <div
                            className="bg-contain w-full h-40 bg-center bg-no-repeat"
                            style={{ backgroundImage: `url("${thumbnail}")` }}
                          />
                        </div>
                      )}
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res = []) => {
                          const file = res.at(0);
                          if (file) {
                            projectForm.setValue("thumbnail", file.url);
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>

        <div className="flex flex-col gap-2 mt-4">
          <div className="flex flex-row gap-2 flex-wrap">
            <div className="flex flex-row items-center gap-2">
              <TypographyH4>Tech Stack</TypographyH4>
              <TechnologyAdd
                onSelect={addTechToStack}
                selectedMap={currentStack}
                technologies={technologies}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              {Object.values(currentStack).map((tech) => (
                <Badge
                  key={tech.id}
                  className="flex items-center whitespace-nowrap"
                >
                  <Button
                    size="icon"
                    className="w-4 h-4 mr-2"
                    onClick={() => addTechToStack(tech)}
                  >
                    <IconX className="w-4 h-4" />
                  </Button>
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Button className="self-end" disabled={pending} onClick={submit}>
          {pending ? (
            <IconLoader2 className="animate-spin mr-2 w-5 h-5" />
          ) : (
            <IconDeviceFloppy className="mr-2 w-5 h-5" />
          )}
          {projectId ? "Update" : "Save"}
        </Button>
      </div>
    </Form>
  );
}
