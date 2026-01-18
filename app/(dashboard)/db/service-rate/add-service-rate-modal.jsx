import React from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const AddServiceRateModal = ({
  openDialog,
  setOpenDialog,
  editing,
  form,
  setForm,
  handleSave,
  serviceList,
  handleAddService,
  handleServiceChange,
  handleRemoveService,
}) => {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Service Rate" : "Add Service Rate"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Rate Name */}
          <Input
            placeholder="Service Rate Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* Services Table */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Services *</label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddService}
              >
                Add Service
              </Button>
            </div>

            {form.services.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No services added. Click "Add Service" to add one.
              </p>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Name</TableHead>
                      <TableHead>Service Code</TableHead>
                      <TableHead>Service Rate</TableHead>
                      <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {form.services.map((serviceItem, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Select
                            value={serviceItem.service}
                            onValueChange={(value) =>
                              handleServiceChange(index, "service", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Service *" />
                            </SelectTrigger>
                            <SelectContent>
                              {serviceList.map((svc) => (
                                <SelectItem key={svc._id} value={svc._id}>
                                  {svc.serviceName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Service Code *"
                            value={serviceItem.service_code || ""}
                            onChange={(e) =>
                              handleServiceChange(
                                index,
                                "service_code",
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder="Service Rate *"
                            value={serviceItem.price || ""}
                            onChange={(e) =>
                              handleServiceChange(
                                index,
                                "price",
                                e.target.value
                              )
                            }
                            min="0"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveService(index)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
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

export default AddServiceRateModal;
