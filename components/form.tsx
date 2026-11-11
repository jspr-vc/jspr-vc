"use client";

import { IconCheck, IconDeviceFloppy, IconLoader2 } from "@tabler/icons-react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
  type ComponentProps,
  type ReactNode,
  useState,
  useSyncExternalStore,
} from "react";
import {
  clearPendingFiles,
  getPendingFile,
  setPendingFile,
  subscribePendingFiles,
  UploadError,
  uploadPendingFiles,
} from "@/lib/pending-uploads";
import { DateField } from "./date-field";
import { ImageField } from "./image-field";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

interface FieldShellProps {
  label: string;
  description?: ReactNode;
  className?: string;
}

/*
 * Label, description and error around a control. Errors show once the field
 * has been touched, which a submit attempt does for every field.
 */
function FieldShell({
  label,
  description,
  className,
  htmlFor,
  children,
}: FieldShellProps & { htmlFor?: string; children: ReactNode }) {
  const field = useFieldContext<unknown>();
  const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={invalid} className={className}>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children}
      {description && <FieldDescription>{description}</FieldDescription>}
      {invalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}

function useInvalid() {
  const field = useFieldContext<unknown>();
  return field.state.meta.isTouched && !field.state.meta.isValid;
}

function TextField({
  label,
  description,
  className,
  ...props
}: FieldShellProps & Omit<ComponentProps<typeof Input>, "value" | "name">) {
  const field = useFieldContext<string | null | undefined>();
  const invalid = useInvalid();

  return (
    <FieldShell
      label={label}
      description={description}
      className={className}
      htmlFor={field.name}
    >
      <Input
        {...props}
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={invalid}
      />
    </FieldShell>
  );
}

function TextareaField({
  label,
  description,
  className,
  inputClassName,
  ...props
}: FieldShellProps & { inputClassName?: string } & Omit<
    ComponentProps<typeof Textarea>,
    "value" | "name" | "className"
  >) {
  const field = useFieldContext<string | null | undefined>();
  const invalid = useInvalid();

  return (
    <FieldShell
      label={label}
      description={description}
      className={className}
      htmlFor={field.name}
    >
      <Textarea
        {...props}
        className={inputClassName}
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={invalid}
      />
    </FieldShell>
  );
}

function DatePickerField({
  label,
  description,
  className,
  placeholder,
  required = false,
}: FieldShellProps & { placeholder?: string; required?: boolean }) {
  const field = useFieldContext<Date | null | undefined>();

  return (
    <FieldShell label={label} description={description} className={className}>
      <DateField
        value={field.state.value}
        placeholder={placeholder}
        onChange={(date) => {
          // A required date keeps its value when the picker is cleared.
          if (date || !required) field.handleChange(date ?? null);
        }}
      />
    </FieldShell>
  );
}

function ImageUploadField({ label, description, className }: FieldShellProps) {
  const field = useFieldContext<string | null | undefined>();
  const file = useSyncExternalStore(
    subscribePendingFiles,
    () => getPendingFile(field.form, field.name),
    () => undefined,
  );

  return (
    <FieldShell label={label} description={description} className={className}>
      <ImageField
        value={field.state.value}
        file={file}
        onPick={(picked) => setPendingFile(field.form, field.name, picked)}
        onRemove={() => {
          setPendingFile(field.form, field.name);
          field.handleChange("");
        }}
      />
    </FieldShell>
  );
}

function SubmitButton({
  children,
  ...props
}: Omit<ComponentProps<typeof Button>, "disabled">) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button size="lg" type="submit" disabled={isSubmitting} {...props}>
          {isSubmitting ? (
            <IconLoader2 className="animate-spin" />
          ) : (
            <IconDeviceFloppy />
          )}
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
}

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    DatePickerField,
    ImageUploadField,
  },
  formComponents: { SubmitButton },
});

type SaveState = "idle" | "saved" | "failed" | "upload-failed";

/*
 * Runs a save and tracks its outcome so the form can say so. Server actions
 * hide their error messages in production, so a failure gets a general message.
 */
export function useSaveStatus() {
  const [state, setState] = useState<SaveState>("idle");

  /*
   * Uploads any images picked in the form, then hands the values (with the
   * image URLs filled in) to `save`.
   */
  const run = async <T extends object>(
    form: object,
    values: T,
    save: (values: T) => Promise<void>,
  ) => {
    setState("idle");
    try {
      await save(await uploadPendingFiles(form, values));
      clearPendingFiles(form);
      setState("saved");
    } catch (error) {
      if (isRedirectError(error)) throw error;
      console.error(error);
      setState(error instanceof UploadError ? "upload-failed" : "failed");
    }
  };

  return { state, run };
}

export function SaveStatus({
  state,
  failure = "Could not save. Check the fields and try again.",
}: {
  state: SaveState;
  failure?: string;
}) {
  if (state === "saved") {
    return (
      <p
        role="status"
        className="flex items-center gap-1.5 text-muted-foreground text-sm"
      >
        <IconCheck className="size-4" />
        Saved
      </p>
    );
  }
  if (state === "failed" || state === "upload-failed") {
    return (
      <p role="alert" className="text-destructive text-sm">
        {state === "failed"
          ? failure
          : "The image could not be uploaded, so nothing was saved. Try again."}
      </p>
    );
  }
  return null;
}
