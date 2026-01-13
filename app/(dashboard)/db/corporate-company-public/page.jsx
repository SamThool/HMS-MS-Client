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

const CorporateCompanyPublicPage = () => {
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
      const res = await get("/corporate-company-public");
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
      toast.error("Corporate company public name is required");
      return;
    }

    try {
      if (editing) {
        await put(`/corporate-company-public/${editing._id}`, { name });
        toast.success("Company updated");
      } else {
        await post("/corporate-company-public", { name });
        toast.success("Company added");
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
          Corporate Company (Public) Master
        </h2>
        <Button onClick={() => setOpenDialog(true)}>
          Add Corporate Public Company
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr</TableHead>
            <TableHead>Company Name</TableHead>
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
                No corporate public companies found.
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
                ? "Edit Corporate Public Company"
                : "Add Corporate Public Company"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2">
            <Input
              placeholder="Corporate Company Public Name"
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
              Delete Corporate Public Company
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
                  `/corporate-company-public/${deleteTarget._id}`
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

export default CorporateCompanyPublicPage;
