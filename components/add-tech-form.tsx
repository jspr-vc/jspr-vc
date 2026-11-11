"use client";
import type { z } from "zod";
import { slugify } from "@/lib/format";
import { insertTechnologiesSchema } from "@/lib/validators";
import {
  type InsertTechnology,
  insertTechnology,
} from "@/server/server-actions";
import { SaveStatus, useAppForm, useSaveStatus } from "./form";

type Values = z.input<typeof insertTechnologiesSchema>;

interface Props {
  onSuccess: (newTech: InsertTechnology) => void;
}

export function TechnologyAddForm({ onSuccess }: Props) {
  const defaultValues: Values = {
    name: "",
    slug: "",
    description: "",
    icon: "",
  };
  const save = useSaveStatus();
  const form = useAppForm({
    defaultValues,
    validators: { onSubmit: insertTechnologiesSchema },
    onSubmit: ({ value, formApi }) =>
      save.run(formApi, value, async (values) => {
        onSuccess(
          await insertTechnology(insertTechnologiesSchema.parse(values)),
        );
      }),
  });

  return (
    <form
      className="grid grid-cols-1 gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        // Rendered inside another form's dialog; keep the submit from bubbling.
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.AppForm>
        <form.AppField
          name="name"
          listeners={{
            onChange: ({ value }) => {
              if (!form.getFieldMeta("slug")?.isDirty) {
                form.setFieldValue("slug", slugify(value), {
                  dontUpdateMeta: true,
                });
              }
            },
          }}
        >
          {(field) => <field.TextField label="Name" placeholder="Next.js" />}
        </form.AppField>
        <form.AppField name="slug">
          {(field) => <field.TextField label="Slug" placeholder="nextjs" />}
        </form.AppField>
        <form.AppField name="description">
          {(field) => (
            <field.TextareaField
              label="Description"
              placeholder="Shown when someone hovers the tag"
            />
          )}
        </form.AppField>
        <form.AppField name="icon">
          {(field) => <field.ImageUploadField label="Icon" />}
        </form.AppField>
        <SaveStatus state={save.state} />
        <form.SubmitButton>Add technology</form.SubmitButton>
      </form.AppForm>
    </form>
  );
}
