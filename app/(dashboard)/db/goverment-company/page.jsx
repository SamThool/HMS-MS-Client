"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction
} from "@/components/ui/alert-dialog";
import { get, post, put, del } from "@/lib/api";
import { toast } from "sonner";
import Loading from "@/components/loading";

export default function GovernmentCompanyPage() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [delItem, setDelItem] = useState(null);

  const fetchData = async () => {
    const res = await get("/government-company");
    setData(Array.isArray(res) ? res : []);
  };

  useEffect(() => { fetchData(); }, []);

  const save = async () => {
    if (!name.trim()) return toast.error("Name required");
    editing
      ? await put(`/government-company/${editing._id}`, { name })
      : await post("/government-company", { name });
    toast.success(editing ? "Updated" : "Added");
    setOpen(false); setEditing(null); setName(""); fetchData();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Government Company Master</h2>
        <Button onClick={() => setOpen(true)}>Add</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((d, i) => (
            <TableRow key={d._id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{d.name}</TableCell>
              <TableCell className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => {
                  setEditing(d); setName(d.name); setOpen(true);
                }}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => setDelItem(d)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Company</DialogTitle></DialogHeader>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Company Name" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!delItem} onOpenChange={() => setDelItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete</AlertDialogTitle>
            <AlertDialogDescription>Delete {delItem?.name}?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              await del(`/government-company/${delItem._id}`);
              setDelItem(null); fetchData(); toast.success("Deleted");
            }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
