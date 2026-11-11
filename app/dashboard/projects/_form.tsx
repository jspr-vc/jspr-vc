"use client";
import { useStore } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import type { z } from "zod";
import { SaveStatus, useAppForm, useSaveStatus } from "@/components/form";
import { TechStackField } from "@/components/tech-stack-field";
import { slugify } from "@/lib/format";
import { insertProjectSchema } from "@/lib/validators";
import type { GetAllTech, GetProject } from "@/queries";
import { upsertProject } from "@/server/server-actions";

type Values = z.input<typeof insertProjectSchema>;

interface Props {
  project?: GetProject;
  portfolioId: number;
  technologies: GetAllTech;
}

function toValues(portfolioId: number, project?: GetProject): Values {
  return {
    id: project?.id,
    portfolioId,
    name: project?.name ?? "",
    shortDescription: project?.shortDescription ?? "",
    body: project?.body ?? "",
    slug: project?.slug ?? "",
    date: project?.date ?? new Date(),
    stack: project?.stack.map((projectTech) => projectTech.tech.id) ?? [],
    thumbnail: project?.thumbnail ?? "",
    link: project?.link ?? "",
  };
}

export function ProjectForm({ project, technologies, portfolioId }: Props) {
  const router = useRouter();
  const save = useSaveStatus();
  const form = useAppForm({
    defaultValues: toValues(portfolioId, project),
    validators: { onSubmit: insertProjectSchema },
    onSubmit: ({ value, formApi }) =>
      save.run(formApi, value, async (values) => {
        const saved = await upsertProject(insertProjectSchema.parse(values));
        if (!saved) {
          throw new Error("Project was not saved");
        }
        formApi.reset(toValues(portfolioId, saved));

        if (value.id !== saved.id) {
          router.push(`/dashboard/projects/${saved.id}/edit`);
        }
      }),
  });

  const projectId = useStore(form.store, (state) => state.values.id);
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
          <form.AppField
            name="name"
            listeners={{
              // A new project's slug follows its name until the slug is edited.
              onChange: ({ value }) => {
                if (!project && !form.getFieldMeta("slug")?.isDirty) {
                  form.setFieldValue("slug", slugify(value), {
                    dontUpdateMeta: true,
                  });
                }
              },
            }}
          >
            {(field) => <field.TextField label="Project name" />}
          </form.AppField>
          <form.AppField name="slug">
            {(field) => (
              <field.TextField
                label="Slug"
                placeholder="my-project"
                description="Lowercase letters, numbers and dashes."
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name="link">
          {(field) => (
            <field.TextField
              label="Link"
              placeholder="https://"
              description="Where the project lives. Its name links here on your portfolio."
            />
          )}
        </form.AppField>
        <form.AppField name="date">
          {(field) => (
            <field.DatePickerField
              label="Start date"
              required
              className="sm:max-w-xs"
            />
          )}
        </form.AppField>
        <form.AppField name="shortDescription">
          {(field) => (
            <field.TextareaField
              label="Short description"
              description="Markdown supported, no headings."
            />
          )}
        </form.AppField>
        <form.AppField name="body">
          {(field) => (
            <field.TextareaField
              label="Body"
              description="Markdown supported."
              inputClassName="min-h-72"
            />
          )}
        </form.AppField>
        <TechStackField
          technologies={technologies}
          value={stack}
          onChange={(ids) => form.setFieldValue("stack", ids)}
        />
        <form.AppField name="thumbnail">
          {(field) => <field.ImageUploadField label="Thumbnail" />}
        </form.AppField>
        <div className="flex flex-wrap items-center justify-end gap-4">
          <SaveStatus
            state={save.state}
            failure="Could not save. If you changed the slug, it may already be taken."
          />
          <form.SubmitButton>
            {projectId ? "Save changes" : "Add project"}
          </form.SubmitButton>
        </div>
      </form.AppForm>
    </form>
  );
}
