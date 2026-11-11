"use client";

import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import type { GetAllTech } from "@/queries";
import type { InsertTechnology } from "@/server/server-actions";
import { TechnologyAddForm } from "./add-tech-form";
import { Button } from "./ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "./ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type Tech = GetAllTech[number];

interface Props {
  technologies: GetAllTech;
  value: number[];
  onChange: (techIds: number[]) => void;
}

export function TechStackField({ technologies, value, onChange }: Props) {
  const anchor = useComboboxAnchor();
  const [formOpen, setFormOpen] = useState(false);
  const [created, setCreated] = useState<Record<number, Tech>>({});

  const all = { ...technologies, ...created };
  const items = Object.values(all).sort((a, b) => a.name.localeCompare(b.name));
  const selected = value
    .map((id) => all[id])
    .filter((tech): tech is Tech => Boolean(tech));

  const onCreated = (tech: InsertTechnology) => {
    setCreated((prev) => ({ ...prev, [tech.id]: tech }));
    if (!value.includes(tech.id)) {
      onChange([...value, tech.id]);
    }
    setFormOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium text-sm leading-none">Tech stack</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setFormOpen(true)}
        >
          <IconPlus />
          New technology
        </Button>
      </div>
      <Combobox
        multiple
        autoHighlight
        items={items}
        value={selected}
        onValueChange={(next: Tech[]) => onChange(next.map((tech) => tech.id))}
        itemToStringLabel={(tech: Tech) => tech.name}
        isItemEqualToValue={(a: Tech, b: Tech) => a.id === b.id}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: Tech[]) => (
              <>
                {values.map((tech) => (
                  <ComboboxChip key={tech.id} aria-label={tech.name}>
                    {tech.name}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput
                  aria-label="Tech stack"
                  placeholder={values.length ? "" : "Search technologies"}
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No match. Add it with “New technology”.</ComboboxEmpty>
          <ComboboxList>
            {(tech: Tech) => (
              <ComboboxItem key={tech.id} value={tech}>
                {tech.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New technology</DialogTitle>
            <DialogDescription>
              It becomes available to pick in every tech stack.
            </DialogDescription>
          </DialogHeader>
          <TechnologyAddForm onSuccess={onCreated} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
