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
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { insertExperienceSchema } from "@/lib/validators";
import type { GetAllTech, GetExp } from "@/queries";
import {
  type InsertTechnology,
  upsertExperience,
} from "@/server/server-actions";

interface Props {
  experience?: GetExp;
  portfolioId: number;
  technologies: GetAllTech;
}

export function ExperienceForm({
  portfolioId,
  experience,
  technologies,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm({
    reValidateMode: "onSubmit",
    resolver: zodResolver(insertExperienceSchema),
    defaultValues: {
      id: experience?.id,
      portfolioId,
      companyName: experience?.companyName ?? "",
      companyWebsite: experience?.companyWebsite ?? "",
      companyLogo: experience?.companyLogo ?? "",
      jobTitle: experience?.jobTitle ?? "",
      jobDescription: experience?.jobDescription ?? "",
      startedAt: experience?.startedAt ?? new Date(),
      endedAt: experience?.endedAt,
      stack: experience?.stack.map((expTech) => expTech.tech.id) ?? [],
    },
  });

  const [experienceId, companyLogo] = form.watch(["id", "companyLogo"]);
  const submit = form.handleSubmit(async (data) => {
    startTransition(async () => {
      const newExp = await upsertExperience(data);
      if (!newExp) {
        return;
      }
      form.reset({
        id: newExp.id,
        portfolioId,
        companyName: newExp.companyName ?? "",
        jobTitle: newExp.jobTitle ?? "",
        companyWebsite: newExp.companyWebsite ?? "",
        companyLogo: newExp.companyLogo ?? "",
        jobDescription: newExp.jobDescription ?? "",
        startedAt: newExp.startedAt ?? new Date(),
        endedAt: newExp.endedAt,
        stack: newExp.stack.map((expTech) => expTech.tech.id),
      });

      if (!experienceId) {
        router.push(`/dashboard/experiences/${newExp.id}/edit`);
      }
    });
  });

  const currentStack = form
    .watch("stack")
    .reduce<Record<number, GetAllTech[number]>>((acc, curr) => {
      const tech = technologies[curr];
      if (!tech) return acc;
      Object.assign(acc, { [curr]: tech });
      return acc;
    }, {});

  const addTechToStack = (tech: InsertTechnology) => {
    if (currentStack[tech.id]) {
      const newStack = form.getValues("stack").filter((id) => id !== tech.id);
      form.setValue("stack", newStack);
      return;
    }
    const index = form.getValues("stack").length;
    form.setValue(`stack.${index}`, tech.id);
    technologies[tech.id] = tech;
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-4">
        <form>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Linux Merch Gurus (LMG)..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyWebsite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ttlstore.com..."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="I code..."
                      {...field}
                      className="min-h-[200px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyLogo"
              render={() => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2 items-center ring-1 ring-muted p-8">
                      {companyLogo && (
                        <div className="relative p-4 bg-card/30 rounded-md w-full">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => form.setValue("companyLogo", "")}
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                          <div
                            className="bg-contain w-full h-40 bg-center bg-no-repeat"
                            style={{ backgroundImage: `url("${companyLogo}")` }}
                          />
                        </div>
                      )}
                      <UploadDropzone
                        className="w-full"
                        endpoint="imageUploader"
                        onClientUploadComplete={(res = []) => {
                          const file = res.at(0);
                          if (file) {
                            form.setValue("companyLogo", file.ufsUrl);
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startedAt"
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
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) =>
                            field.onChange(date || form.getValues("startedAt"))
                          }
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endedAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
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
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={(date) => field.onChange(date)}
                          disabled={(date) => date < new Date("1900-01-01")}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
          {experienceId ? "Update" : "Save"}
        </Button>
      </div>
    </Form>
  );
}
