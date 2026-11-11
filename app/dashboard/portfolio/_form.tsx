"use client";
import type { z } from "zod";
import { SaveStatus, useAppForm, useSaveStatus } from "@/components/form";
import { updatePortfolioSchema } from "@/lib/validators";
import type { GetPortfolio } from "@/queries";
import { updatePortfolio } from "@/server/server-actions";

type Values = z.input<typeof updatePortfolioSchema>;

export interface PortfolioFormProps {
  portfolio: NonNullable<GetPortfolio>;
}

export function PortfolioForm({ portfolio }: PortfolioFormProps) {
  const defaultValues: Values = {
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
  };
  const save = useSaveStatus();
  const form = useAppForm({
    defaultValues,
    validators: { onSubmit: updatePortfolioSchema },
    onSubmit: ({ value, formApi }) =>
      save.run(formApi, value, async (values) => {
        await updatePortfolio(updatePortfolioSchema.parse(values));
        formApi.reset(values);
      }),
  });

  return (
    <form
      className="flex flex-col gap-10"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.AppForm>
        <section>
          <h2 className="mb-5 font-mono font-semibold text-lg tracking-mono-display">
            general
          </h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <form.AppField name="name">
              {(field) => <field.TextField label="Name" />}
            </form.AppField>
            <form.AppField name="slug">
              {(field) => (
                <field.TextField
                  label="Slug"
                  description="Your page: /your-slug"
                />
              )}
            </form.AppField>
            <form.AppField name="publicEmail">
              {(field) => <field.TextField label="Public email" />}
            </form.AppField>
            <form.AppField name="headline">
              {(field) => (
                <field.TextField label="Headline" className="col-span-full" />
              )}
            </form.AppField>
            <form.AppField name="subheading">
              {(field) => (
                <field.TextareaField
                  label="Subheading"
                  description="Markdown supported."
                  className="col-span-full"
                  inputClassName="h-20"
                />
              )}
            </form.AppField>
            <form.AppField name="about">
              {(field) => (
                <field.TextareaField
                  label="About"
                  description="Markdown supported."
                  className="col-span-full"
                  inputClassName="h-64"
                />
              )}
            </form.AppField>
          </div>
        </section>
        <section>
          <h2 className="mb-5 font-mono font-semibold text-lg tracking-mono-display">
            links
          </h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <form.AppField name="socialLinks.github">
              {(field) => (
                <field.TextField
                  label="GitHub"
                  placeholder="https://github.com/you"
                />
              )}
            </form.AppField>
            <form.AppField name="socialLinks.linkedin">
              {(field) => (
                <field.TextField
                  label="LinkedIn"
                  placeholder="https://www.linkedin.com/in/you"
                />
              )}
            </form.AppField>
            <form.AppField name="socialLinks.twitter">
              {(field) => (
                <field.TextField
                  label="Twitter"
                  placeholder="https://twitter.com/you"
                />
              )}
            </form.AppField>
            <form.AppField name="socialLinks.website">
              {(field) => (
                <field.TextField label="Website" placeholder="https://" />
              )}
            </form.AppField>
          </div>
        </section>
        <div className="flex flex-wrap items-center justify-end gap-4">
          <SaveStatus
            state={save.state}
            failure="Could not save. If you changed the slug, it may already be taken."
          />
          <form.SubmitButton>Save changes</form.SubmitButton>
        </div>
      </form.AppForm>
    </form>
  );
}
