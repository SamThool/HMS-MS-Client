"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

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
import AddServiceRateModal from "./add-service-rate-modal";

const ServiceRatePage = () => {
  const [data, setData] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [loading, setLoading] = useState(false);

  // add/edit
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    services: [], // [{service: id, price: number}]
  });

  // delete
  const [singleDeleteOpen, setSingleDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ---------------- FETCH ---------------- fencing
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [serviceRateData, serviceListData] = await Promise.all([
        get("/service-rate"),
        get("/service-list"),
      ]);

      setData(
        Array.isArray(serviceRateData?.data)
          ? serviceRateData.data
          : Array.isArray(serviceRateData)
          ? serviceRateData
          : []
      );

      setServiceList(
        Array.isArray(serviceListData?.data)
          ? serviceListData.data
          : Array.isArray(serviceListData)
          ? serviceListData
          : []
      );
    } catch (error) {
      console.error("Fetch error:", error);
      setData([]);
      setServiceList([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ---------------- SAVE ----------------
  const handleSave = async () => {
    if (!form.name || form.services.length === 0) {
      toast.error("Name and at least one service with price are required");
      return;
    }

    // Validate all services have valid price
    const invalidService = form.services.find(
      (s) => !s.service || s.price === undefined || s.price < 0
    );
    if (invalidService) {
      toast.error("All services must have valid prices");
      return;
    }

    try {
      const payload = {
        name: form.name,
        services: form.services.map((s) => ({
          service: s.service,
          price: parseFloat(s.price),
          service_code: s.service_code,
        })),
      };

      if (editing) {
        await put(`/service-rate/${editing._id}`, payload);
        toast.success("Service rate updated");
      } else {
        await post("/service-rate", payload);
        toast.success("Service rate added");
      }
      setOpenDialog(false);
      setEditing(null);
      setForm({ name: "", services: [] });
      fetchAll();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  // ---------------- ADD SERVICE TO FORM ----------------
  const handleAddService = () => {
    setForm((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { service: "", price: "", service_code: "" },
      ],
    }));
  };

  // ---------------- REMOVE SERVICE FROM FORM ----------------
  const handleRemoveService = (index) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  // ---------------- UPDATE SERVICE IN FORM ----------------
  const handleServiceChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
  };

  // ---------------- OPEN DIALOG FOR EDIT ----------------
  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || "",
      services: Array.isArray(item.services)
        ? item.services.map((s) => ({
            service: typeof s.service === "object" ? s.service._id : s.service,
            price: s.price || "",
            service_code: s.service_code || "",
          }))
        : [],
    });
    setOpenDialog(true);
  };

  // ---------------- RESET FORM ----------------
  const handleOpenDialog = () => {
    setEditing(null);
    setForm({ name: "", services: [] });
    setOpenDialog(true);
  };

  // ---------------- DELETE ----------------
  const confirmSingleDelete = async () => {
    try {
      await del(`/service-rate/${deleteTarget._id}`);
      setSingleDeleteOpen(false);
      setDeleteTarget(null);
      fetchAll();
      toast.success("Service rate deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Service Rate Master</h2>
        <Button onClick={handleOpenDialog}>Add Service Rate</Button>
      </div>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Rate List Name</TableHead>
            <TableHead>Services Count</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5}>
                <Loading />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>No service rates found.</TableCell>
            </TableRow>
          ) : (
            data.map((d, i) => (
              <TableRow key={d._id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.services?.length || 0}</TableCell>

                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(d)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setDeleteTarget(d);
                      setSingleDeleteOpen(true);
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

      {/* ADD / EDIT DIALOG */}
      <AddServiceRateModal
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        editing={editing}
        form={form}
        setForm={setForm}
        handleSave={handleSave}
        serviceList={serviceList}
        handleAddService={handleAddService}
        handleServiceChange={handleServiceChange}
        handleRemoveService={handleRemoveService}
      />

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={singleDeleteOpen} onOpenChange={setSingleDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service Rate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSingleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServiceRatePage;
