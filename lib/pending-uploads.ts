import { upload } from "@vercel/blob/client";

/*
 * Images picked in a form are held here until the form is saved, then
 * uploaded and swapped for their URL. Keyed by form, then by field name.
 */
const pending = new WeakMap<object, Map<string, File>>();
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

export function subscribePendingFiles(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPendingFile(form: object, field: string) {
  return pending.get(form)?.get(field);
}

export function setPendingFile(form: object, field: string, file?: File) {
  const files = pending.get(form) ?? new Map<string, File>();
  if (file) {
    files.set(field, file);
  } else {
    files.delete(field);
  }
  pending.set(form, files);
  notify();
}

export function clearPendingFiles(form: object) {
  pending.delete(form);
  notify();
}

export class UploadError extends Error {}

/*
 * Uploads every image waiting on this form and returns the values with each
 * one replaced by its URL. The files stay pending until the save succeeds,
 * so a failed save can be retried without picking them again.
 */
export async function uploadPendingFiles<T extends object>(
  form: object,
  values: T,
): Promise<T> {
  const files = pending.get(form);
  if (!files?.size) {
    return values;
  }

  const uploaded = await Promise.all(
    [...files].map(async ([field, file]) => {
      try {
        const blob = await upload(`uploads/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
          clientPayload: JSON.stringify({ name: file.name, size: file.size }),
        });
        return [field, blob.url] as const;
      } catch (cause) {
        throw new UploadError(`Could not upload ${file.name}`, { cause });
      }
    }),
  );

  return { ...values, ...Object.fromEntries(uploaded) };
}
