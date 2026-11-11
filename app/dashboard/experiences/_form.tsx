"use client";
import { useStore } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import type { z } from "zod";
import { SaveStatus, useAppForm, useSaveStatus } from "@/components/form";
import { TechStackField } from "@/components/tech-stack-field";
import { insertExperienceSchema } from "@/lib/validators";
import type { GetAllTech, GetExp } from "@/queries";
import { upsertExperience } from "@/server/server-actions";

type Values = z.input<typeof insertExperienceSchema>;

interface Props {
  experience?: GetExp;
  portfolioId: number;
  technologies: GetAllTech;
}

function toValues(portfolioId: number, experience?: GetExp): Values {
  return {
    id: experience?.id,
    portfolioId,
    companyName: experience?.companyName ?? "",
    companyWebsite: experience?.companyWebsite ?? "",
    companyLogo: experience?.companyLogo ?? "",
    jobTitle: experience?.jobTitle ?? "",
    jobDescription: experience?.jobDescription ?? "",
    startedAt: experience?.startedAt ?? new Date(),
    endedAt: experience?.endedAt ?? null,
    stack: experience?.stack.map((expTech) => expTech.tech.id) ?? [],
  };
}

export function ExperienceForm({
  portfolioId,
  experience,
  technologies,
}: Props) {
  const router = useRouter();
  const save = useSaveStatus();
  const form = useAppForm({
    defaultValues: toValues(portfolioId, experience),
    validators: { onSubmit: insertExperienceSchema },
    onSubmit: ({ value, formApi }) =>
      save.run(formApi, value, async (values) => {
        const saved = await upsertExperience(
          insertExperienceSchema.parse(values),
        );
        if (!saved) {
          throw new Error("Experience was not saved");
        }
        formApi.reset(toValues(portfolioId, saved));

        if (!value.id) {
          router.push(`/dashboard/experiences/${saved.id}/edit`);
        }
      }),
  });

  const experienceId = useStore(form.store, (state) => state.values.id);
  const stack = useStore(form.store, (state) => state.values.stack);

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.AppForm>
        <div className="grid gap-5 sm:grid-cols-2">
          <form.AppField name="jobTitle">
            {(field) => (
              <field.TextField
                label="Job title"
                placeholder="Software Engineer"
              />
            )}
          </form.AppField>
          <form.AppField name="companyName">
            {(field) => <field.TextField label="Company name" />}
          </form.AppField>
        </div>
        <form.AppField name="companyWebsite">
          {(field) => (
            <field.TextField label="Company website" placeholder="https://" />
          )}
        </form.AppField>
        <div className="grid gap-5 sm:grid-cols-2">
          <form.AppField name="startedAt">
            {(field) => <field.DatePickerField label="Start date" required />}
          </form.AppField>
          <form.AppField name="endedAt">
            {(field) => (
              <field.DatePickerField
                label="End date"
                placeholder="Still working here"
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name="jobDescription">
          {(field) => (
            <field.TextareaField
              label="Job description"
              description="Markdown supported, no headings."
              inputClassName="min-h-48"
            />
          )}
        </form.AppField>
        <TechStackField
          technologies={technologies}
          value={stack}
          onChange={(ids) => form.setFieldValue("stack", ids)}
        />
        <form.AppField name="companyLogo">
          {(field) => <field.ImageUploadField label="Company logo" />}
        </form.AppField>
        <div className="flex flex-wrap items-center justify-end gap-4">
          <SaveStatus state={save.state} />
          <form.SubmitButton>
            {experienceId ? "Save changes" : "Add experience"}
          </form.SubmitButton>
        </div>
      </form.AppForm>
    </form>
  );
}
