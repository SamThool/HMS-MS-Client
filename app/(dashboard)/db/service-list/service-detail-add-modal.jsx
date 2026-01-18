import React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

const ServiceDetailAddModal = ({
  openDialog,
  setOpenDialog,
  editing,
  form,
  setForm,
  billGroups,
  ledgers,
  subLedgers,
  departments,
  handleDepartmentToggle,
  handleSave,
}) => {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-xs md:max-w-xl lg:max-w-2xl xl:max-w-3xl w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Service Detail" : "Add Service Detail"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          {/* Service Name */}
          <Input
            placeholder="Service Name *"
            value={form.serviceName}
            onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
          />

          {/* Alternate Service Name */}
          <Input
            placeholder="Alternate Service Name"
            value={form.alternateServiceName}
            onChange={(e) =>
              setForm({ ...form, alternateServiceName: e.target.value })
            }
          />

          {/* Bill Group */}
          <Select
            value={form.billGroup}
            onValueChange={(v) => setForm({ ...form, billGroup: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Bill Group *" />
            </SelectTrigger>
            <SelectContent>
              {billGroups.map((bg) => (
                <SelectItem key={bg._id} value={bg._id}>
                  {bg.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Ledger */}
          <Select
            value={form.ledger}
            onValueChange={(v) =>
              setForm({ ...form, ledger: v, subLedger: "" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Ledger *" />
            </SelectTrigger>
            <SelectContent>
              {ledgers.map((l) => (
                <SelectItem key={l._id} value={l._id}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sub Ledger */}
          <Select
            value={form.subLedger}
            onValueChange={(v) => setForm({ ...form, subLedger: v })}
            disabled={!form.ledger}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sub Ledger *" />
            </SelectTrigger>
            <SelectContent>
              {subLedgers
                .filter((s) => {
                  const ledgerId = s.ledger?._id || s.ledger;
                  return ledgerId === form.ledger;
                })
                .map((s) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Departments - Multi-select dropdown */}
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-medium">Departments</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !form.departments.length && "text-muted-foreground"
                  )}
                >
                  {form.departments.length > 0
                    ? `${form.departments.length} department(s) selected`
                    : "Select departments"}
                  <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
              >
                <div className="max-h-[300px] overflow-y-auto p-2">
                  {departments.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-2">
                      No departments available
                    </div>
                  ) : (
                    departments.map((dept) => (
                      <div
                        key={dept._id}
                        className="flex items-center space-x-2 p-2 rounded-sm hover:bg-accent cursor-pointer"
                        onClick={() => handleDepartmentToggle(dept._id)}
                      >
                        <Checkbox
                          checked={form.departments.includes(dept._id)}
                          onCheckedChange={() =>
                            handleDepartmentToggle(dept._id)
                          }
                        />
                        <label className="text-sm font-normal cursor-pointer flex-1">
                          {dept.departmentName}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{editing ? "Update" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailAddModal;
