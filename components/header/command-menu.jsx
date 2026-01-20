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
import { get } from "@/lib/api";

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
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        console.log("Searching OPD:", query); // 👈 DEBUG
        setLoading(true);
        const res = await get(`/opd/search?q=${query}`);
        console.log("Search result:", res);
        setResults(res || []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

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
        placeholder="Search by name, UHID, OPD no, phone..."
        value={query}
        onValueChange={setQuery}
      />

      <CommandList className="max-h-[400px] overflow-y-auto">
        {loading && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Searching...
          </div>
        )}

        {!loading && results.length === 0 && (
          <CommandEmpty>No patients found.</CommandEmpty>
        )}

        {!loading && results.length > 0 && (
          <CommandGroup heading="OPD Patients">
            {results.map((o) => (
              <CommandItem
                key={o._id}
                value={`${o.opdno} ${o.patient?.fname} ${o.patient?.mobileNumber}`}
                onSelect={() => {
                  setOpen(false);
                  // router.push(`/opd/${o._id}`)
                }}
                className="flex items-center gap-3 px-3 py-3 cursor-pointer"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {o.patient?.fname} {o.patient?.lname}
                    </span>
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                      {o.opdno}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {o.patient?.mobileNumber || "-"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      {o.patient?.uhid}
                    </span>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
