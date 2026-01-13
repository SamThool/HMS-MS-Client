"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { get, post, put, del } from "@/lib/api";
import { toast } from "sonner";
import Loading from "@/components/loading";

const InsuranceCompanyPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // ---------------- FETCH ----------------
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await get("/insurance-company");
      setData(Array.isArray(res) ? res : []);
    } catch {
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- SAVE ----------------
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Insurance company name is required");
      return;
    }

    try {
      if (editing) {
        await put(`/insurance-company/${editing._id}`, { name });
        toast.success("Insurance company updated");
      } else {
        await post("/insurance-company", { name });
        toast.success("Insurance company added");
      }

      setOpenDialog(false);
      setName("");
      setEditing(null);
      fetchData();
    } catch {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Insurance Company Master
        </h2>
        <Button onClick={() => setOpenDialog(true)}>
          Add Insurance Company
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr</TableHead>
            <TableHead>Insurance Company Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3}>
                <Loading />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}>
                No insurance companies found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((d, i) => (
              <TableRow key={d._id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{d.name}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditing(d);
                      setName(d.name);
                      setOpenDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setDeleteTarget(d);
                      setDeleteOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Add / Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {editing
                ? "Edit Insurance Company"
                : "Add Insurance Company"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2">
            <Input
              placeholder="Insurance Company Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editing ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Insurance Company
            </AlertDialogTitle>
            <AlertDialogDescription>
              Delete <strong>{deleteTarget?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await del(
                  `/insurance-company/${deleteTarget._id}`
                );
                setDeleteOpen(false);
                fetchData();
                toast.success("Deleted");
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InsuranceCompanyPage;
