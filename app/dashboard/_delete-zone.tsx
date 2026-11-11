"use client";

import { IconLoader2, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Props {
  /** What gets deleted, lowercase: "experience", "account". */
  noun: string;
  consequence: string;
  action: () => Promise<unknown>;
  redirectTo: string;
}

export function DeleteZone({ noun, consequence, action, redirectTo }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [opened, setOpened] = useState(false);

  const onDelete = () => {
    startTransition(async () => {
      await action();
      setOpened(false);
      router.push(redirectTo);
    });
  };

  return (
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-destructive/30 p-4">
      <div>
        <h2 className="font-medium">Delete this {noun}</h2>
        <p className="text-muted-foreground text-sm">{consequence}</p>
      </div>
      <AlertDialog open={opened} onOpenChange={setOpened}>
        <AlertDialogTrigger render={<Button variant="destructive" size="lg" />}>
          <IconTrash />
          Delete {noun}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {noun}?</AlertDialogTitle>
            <AlertDialogDescription>{consequence}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Keep it</AlertDialogCancel>
            <Button variant="destructive" disabled={pending} onClick={onDelete}>
              {pending ? (
                <IconLoader2 className="animate-spin" />
              ) : (
                <IconTrash />
              )}
              Delete {noun}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
