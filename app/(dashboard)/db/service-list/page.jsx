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

import ServiceDetailAddModal from "./service-detail-add-modal";

const ServiceDetailPage = () => {
  const [data, setData] = useState([]);
  const [billGroups, setBillGroups] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [subLedgers, setSubLedgers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  // add/edit
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    serviceName: "",
    alternateServiceName: "",
    billGroup: "",
    ledger: "",
    subLedger: "",
    departments: [], // array of department IDs
  });

  // delete
  const [singleDeleteOpen, setSingleDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ---------------- FETCH ----------------
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [serviceListData, bg, l, sl, dept] = await Promise.all([
        get("/service-list"),
        get("/bill-group"),
        get("/ledger"),
        get("/sub-ledger"),
        get("/department"),
      ]);

      // Debug logging - you can remove this after fixing
      console.log("Bill Groups Response:", bg);

      // Service list response: { success: true, data: [...] }
      setData(
        Array.isArray(serviceListData?.data)
          ? serviceListData.data
          : Array.isArray(serviceListData)
            ? serviceListData
            : [],
      );

      // Bill groups response: { success: true, data: [...] }
      // Handle multiple response formats
      let billGroupsData = [];
      if (Array.isArray(bg?.data)) {
        billGroupsData = bg.data;
      } else if (Array.isArray(bg)) {
        billGroupsData = bg;
      }
      setBillGroups(billGroupsData);

      // Ledger response: { success: true, data: [...] }
      setLedgers(Array.isArray(l?.data) ? l.data : Array.isArray(l) ? l : []);

      // Sub-ledger response: direct array
      setSubLedgers(Array.isArray(sl) ? sl : []);

      // Department response: direct array
      setDepartments(Array.isArray(dept) ? dept : []);

      // Debug: Check if bill groups were set
      console.log("Bill Groups Set:", billGroupsData.length);
    } catch (error) {
      console.error("Fetch error:", error);
      setData([]);
      setBillGroups([]);
      setLedgers([]);
      setSubLedgers([]);
      setDepartments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ---------------- SAVE ----------------
  const handleSave = async () => {
    if (
      !form.serviceName ||
      !form.billGroup ||
      !form.ledger ||
      !form.subLedger
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        serviceName: form.serviceName,
        alternateServiceName: form.alternateServiceName,
        billGroup: form.billGroup,
        ledger: form.ledger,
        subLedger: form.subLedger,
        departments: form.departments,
      };

      if (editing) {
        await put(`/service-list/${editing._id}`, payload);
        toast.success("Service detail updated");
      } else {
        await post("/service-list", payload);
        toast.success("Service detail added");
      }
      setOpenDialog(false);
      setEditing(null);
      setForm({
        serviceName: "",
        alternateServiceName: "",
        billGroup: "",
        ledger: "",
        subLedger: "",
        departments: [],
      });
      fetchAll();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  // ---------------- HANDLE DEPARTMENT SELECTION ----------------
  const handleDepartmentToggle = (deptId) => {
    setForm((prev) => ({
      ...prev,
      departments: prev.departments.includes(deptId)
        ? prev.departments.filter((id) => id !== deptId)
        : [...prev.departments, deptId],
    }));
  };

  // ---------------- OPEN DIALOG FOR EDIT ----------------
  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      serviceName: item.serviceName || "",
      alternateServiceName: item.alternateServiceName || "",
      billGroup: item.billGroup?._id || item.billGroup || "",
      ledger: item.ledger?._id || item.ledger || "",
      subLedger: item.subLedger?._id || item.subLedger || "",
      departments: Array.isArray(item.departments)
        ? item.departments.map((d) => d._id || d)
        : [],
    });
    setOpenDialog(true);
  };

  // ---------------- RESET FORM ----------------
  const handleOpenDialog = () => {
    setEditing(null);
    setForm({
      serviceName: "",
      alternateServiceName: "",
      billGroup: "",
      ledger: "",
      subLedger: "",
      departments: [],
    });
    setOpenDialog(true);
  };

  // ---------------- DELETE ----------------
  const confirmSingleDelete = async () => {
    try {
      await del(`/service-list/${deleteTarget._id}`);
      setSingleDeleteOpen(false);
      setDeleteTarget(null);
      fetchAll();
      toast.success("Service detail deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Service Detail Master</h2>
        <Button onClick={handleOpenDialog}>Add Service Detail</Button>
      </div>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Service Name</TableHead>
            <TableHead>Alternate Service Name</TableHead>
            <TableHead>Bill Group</TableHead>
            <TableHead>Ledger</TableHead>
            <TableHead>Sub Ledger</TableHead>
            <TableHead>Departments</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8}>
                <Loading />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8}>No service details found.</TableCell>
            </TableRow>
          ) : (
            data.map((d, i) => (
              <TableRow key={d._id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{d.serviceName}</TableCell>
                <TableCell>{d.alternateServiceName || "-"}</TableCell>
                <TableCell>{d.billGroup?.name || "-"}</TableCell>
                <TableCell>{d.ledger?.name || "-"}</TableCell>
                <TableCell>{d.subLedger?.name || "-"}</TableCell>
                <TableCell>
                  {d.departments && d.departments.length > 0
                    ? d.departments.map((dept, idx) => (
                        <span key={dept._id || dept}>
                          {dept.departmentName || dept}
                          {idx < d.departments.length - 1 ? ", " : ""}
                        </span>
                      ))
                    : "-"}
                </TableCell>
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
      <ServiceDetailAddModal
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        editing={editing}
        form={form}
        setForm={setForm}
        billGroups={billGroups}
        ledgers={ledgers}
        subLedgers={subLedgers}
        departments={departments}
        handleDepartmentToggle={handleDepartmentToggle}
        handleSave={handleSave}
      />

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={singleDeleteOpen} onOpenChange={setSingleDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service Detail</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.serviceName}</strong>? This action cannot
              be undone.
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

export default ServiceDetailPage;
