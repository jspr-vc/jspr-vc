"use client";

import { IconCalendar } from "@tabler/icons-react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface Props {
  value: Date | null | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DateField({
  value,
  onChange,
  placeholder = "Pick a date",
}: Props) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between font-normal"
          />
        }
      >
        {value ? (
          format(value, "PPP")
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <IconCalendar className="text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={value ?? undefined}
          defaultMonth={value ?? undefined}
          onSelect={onChange}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
