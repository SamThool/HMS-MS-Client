"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { User, Phone, Hash, Calendar } from "lucide-react";

export function CommandMenu({ open, setOpen }) {
  // Ctrl / Cmd + K handler
  React.useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setOpen]);

  // Mock patient data - replace with your actual data
  const patients = [
    {
      id: "PT001",
      name: "Sarah Johnson",
      phone: "+1 234-567-8901",
      lastVisit: "2026-01-15",
    },
    {
      id: "PT002",
      name: "Michael Chen",
      phone: "+1 234-567-8902",
      lastVisit: "2026-01-14",
    },
    {
      id: "PT003",
      name: "Emily Rodriguez",
      phone: "+1 234-567-8903",
      lastVisit: "2026-01-13",
    },
    {
      id: "PT004",
      name: "James Williams",
      phone: "+1 234-567-8904",
      lastVisit: "2026-01-12",
    },
    {
      id: "PT005",
      name: "Priya Patel",
      phone: "+1 234-567-8905",
      lastVisit: "2026-01-11",
    },
  ];

  const handleSelectPatient = (patient) => {
    console.log("Selected patient:", patient);
    setOpen(false);
    // Add your navigation or selection logic here
  };

  return (
    <CommandDialog
      className="
    w-full
    max-w-[95vw]
    sm:max-w-sm
    md:max-w-md
    lg:max-w-lg
    xl:max-w-xl
  "
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput
        placeholder="Search by patient name, ID, or phone number..."
        className="text-base"
      />

      <CommandList className="max-h-[400px]">
        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
          No patients found.
        </CommandEmpty>

        <CommandGroup heading="Recent Patients" className="px-2">
          {patients.map((patient) => (
            <CommandItem
              key={patient.id}
              onSelect={() => handleSelectPatient(patient)}
              className="flex items-center gap-3 px-3 py-3 cursor-pointer rounded-md aria-selected:bg-accent"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 dark:bg-blue-500/20">
                <User className="h-5 w-5 text-primary dark:text-blue-400" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {patient.name}
                  </span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {patient.id}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {patient.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {patient.lastVisit}
                  </span>
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
