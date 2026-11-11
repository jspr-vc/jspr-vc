"use client";

import { IconPhotoPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useId, useMemo, useState } from "react";
import { IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/upload-rules";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface Props {
  /** The saved image URL, if any. */
  value: string | null | undefined;
  /** An image picked but not uploaded yet. It uploads when the form saves. */
  file: File | undefined;
  onPick: (file: File) => void;
  onRemove: () => void;
}

export function ImageField({ value, file, onPick, onRemove }: Props) {
  const id = useId();
  const [dragging, setDragging] = useState(false);
  const [problem, setProblem] = useState<string>();

  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : undefined),
    [file],
  );
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const pick = (picked: File | undefined) => {
    if (!picked) return;
    if (!IMAGE_TYPES.includes(picked.type)) {
      setProblem("Use a PNG, JPEG, WebP, GIF or AVIF image.");
      return;
    }
    if (picked.size > MAX_IMAGE_BYTES) {
      setProblem("The image is larger than 4 MB.");
      return;
    }
    setProblem(undefined);
    onPick(picked);
  };

  const shown = preview ?? value;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          pick(event.dataTransfer.files[0]);
        }}
        className={cn(
          "relative flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-4 text-center transition-colors hover:bg-muted/50 has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
          dragging && "border-ring bg-muted/50",
        )}
      >
        {shown ? (
          // biome-ignore lint/performance/noImgElement: previews a local file or an arbitrary stored URL
          <img
            src={shown}
            alt=""
            className="max-h-44 rounded-md object-contain"
          />
        ) : (
          <IconPhotoPlus className="size-7 text-muted-foreground" />
        )}
        <span className="text-sm">
          {shown ? "Choose a different image" : "Choose an image"}
          <span className="text-muted-foreground"> or drop one here</span>
        </span>
        <span className="text-muted-foreground text-xs">
          {file
            ? `${file.name} uploads when you save.`
            : "PNG, JPEG, WebP, GIF or AVIF, up to 4 MB."}
        </span>
        <input
          id={id}
          type="file"
          accept={IMAGE_TYPES.join(",")}
          className="sr-only"
          onChange={(event) => {
            pick(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </label>
      <div className="flex min-h-7 items-center justify-between gap-4">
        <p role="alert" className="text-destructive text-sm">
          {problem}
        </p>
        {shown && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            <IconTrash />
            Remove image
          </Button>
        )}
      </div>
    </div>
  );
}
