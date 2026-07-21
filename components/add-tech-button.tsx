import { IconCheck, IconCirclePlus } from "@tabler/icons-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { GetAllTech } from "@/queries";
import type { InsertTechnology } from "@/server/server-actions";
import { TechnologyAddForm } from "./add-tech-form";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { TypographyP } from "./ui/typography";

interface Props {
  technologies: GetAllTech;
  selectedMap: Record<number, GetAllTech[number]>;
  onSelect: (tech: InsertTechnology) => void;
}

export function TechnologyAdd({ technologies, selectedMap, onSelect }: Props) {
  const [formOpen, setFormOpen] = useState(false);

  const onSuccess = (tech: InsertTechnology) => {
    onSelect(tech);
    setFormOpen(false);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger
          nativeButton={false}
          render={
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button size="icon" variant="ghost" className="h-9 w-9">
                        <IconCirclePlus className="h-7 w-7" />
                      </Button>
                    }
                  />
                  <TooltipContent>
                    <TypographyP>Add new tech stack</TypographyP>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          }
        />
        {/* Dialog takes over scroll listener,
         *  which makes this popover not scrollable when on dialog box.
         *  Tho, search and click & drag still works
         */}
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search technologies" />
            <CommandList>
              <CommandEmpty>Nothing found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  className="cursor-pointer"
                  onSelect={() => setFormOpen(true)}
                >
                  <IconCirclePlus className="mr-2" />
                  Add techonology
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="Technologies">
                {Object.values(technologies).map((technology) => (
                  <CommandItem
                    value={technology.name}
                    key={technology.id}
                    onSelect={() => onSelect(technology)}
                  >
                    <IconCheck
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedMap[technology.id]
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {technology.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Dialog open={formOpen} onOpenChange={(open) => setFormOpen(open)}>
        <DialogContent className="z-50">
          <DialogHeader>
            <DialogTitle>List new technology</DialogTitle>
          </DialogHeader>
          <TechnologyAddForm onSuccess={onSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}
