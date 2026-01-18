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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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

const PayeeRateConfigurationPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dropdown data
  const [payeeCategories, setPayeeCategories] = useState([]);
  const [parentPayees, setParentPayees] = useState([]);
  const [payees, setPayees] = useState([]);
  const [rateLists, setRateLists] = useState([]);

  // Form state - array of rows
  const [rows, setRows] = useState([
    {
      id: 1,
      category: undefined,
      parentPayee: undefined,
      payee: undefined,
      rateList: undefined,
    },
  ]);

  // Delete
  const [singleDeleteOpen, setSingleDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ---------------- FETCH ----------------
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [
        configData,
        categoriesData,
        tpaData,
        rateListsData,
        insuranceData,
      ] = await Promise.all([
        get("/payee-rate-configuration").catch(() => []),
        get("/payee-category").catch(() => []),
        get("/tpa").catch(() => []),
        get("/service-rate").catch(() => []),
        get("/insurance-company").catch(() => []), // For insurance companies
      ]);

      // Set main data
      setData(
        Array.isArray(configData?.data)
          ? configData.data
          : Array.isArray(configData)
          ? configData
          : []
      );

      // Set dropdown options
      setPayeeCategories(
        Array.isArray(categoriesData?.data)
          ? categoriesData.data
          : Array.isArray(categoriesData)
          ? categoriesData
          : []
      );

      setRateLists(
        Array.isArray(rateListsData?.data)
          ? rateListsData.data
          : Array.isArray(rateListsData)
          ? rateListsData
          : []
      );

      const payeeDAta = Array.isArray(tpaData?.data)
        ? tpaData.data
        : Array.isArray(tpaData)
        ? tpaData
        : [];
      setPayees(payeeDAta);

      // Set insurance companies for parentPayee dropdown
      const parentPayeesArray = Array.isArray(insuranceData?.data)
        ? insuranceData.data
        : Array.isArray(insuranceData)
        ? insuranceData
        : [];
      setParentPayees(parentPayeesArray);

      // Initialize rows with existing data if needed
      // Initialize rows with existing data
      const fetchedData = Array.isArray(configData?.data)
        ? configData.data
        : Array.isArray(configData)
        ? configData
        : [];

      if (fetchedData.length > 0) {
        // Convert fetched data into rows format
        const initialRows = fetchedData.map((item, index) => ({
          id: item._id || Date.now() + index,
          _id: item._id, // Preserve _id for updates
          category: item.Category?._id || item.Category,
          parentPayee: item.ParentPayee || undefined,
          payee: item.Payee || undefined,
          rateList: item.rateList?._id || item.rateList,
        }));
        setRows(initialRows);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setData([]);
      setPayeeCategories([]);
      setRateLists([]);
      setParentPayees([]);
      setPayees([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ---------------- ADD ROW ----------------
  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        category: undefined,
        parentPayee: undefined,
        payee: undefined,
        rateList: undefined,
      },
    ]);
  };

  // ---------------- REMOVE ROW ----------------
  const handleRemoveRow = (id) => {
    const row = rows.find((r) => r.id === id);
    if (row?._id) {
      // If it has an _id, it's an existing record - show delete confirmation
      setDeleteTarget({ _id: row._id });
      setSingleDeleteOpen(true);
    } else {
      // If no _id, just remove from local state
      setRows((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // ---------------- UPDATE ROW ----------------
  const handleRowChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          const newValue = value || undefined;
          return { ...row, [field]: newValue };
        }
        return row;
      })
    );
  };

  // ---------------- SAVE ALL ----------------
  const handleSaveAll = async () => {
    // Validate required fields
    const invalidRows = rows.filter((row) => !row.category || !row.rateList);
    if (invalidRows.length > 0) {
      toast.error("Category and Rate List are required for all rows");
      return;
    }

    try {
      const promises = rows.map(async (row) => {
        const payload = {
          Category: row.category,
          ParentPayee: row.parentPayee || null,
          Payee: row.payee || null,
          rateList: row.rateList,
        };

        if (row._id) {
          // Update existing
          return put(`/payee-rate-configuration/${row._id}`, payload);
        } else {
          // Create new
          return post("/payee-rate-configuration", payload);
        }
      });

      await Promise.all(promises);
      toast.success("Payee rate configuration saved");
      fetchAll();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save payee rate configuration");
    }
  };

  // ---------------- DELETE ----------------
  const confirmSingleDelete = async () => {
    try {
      await del(`/payee-rate-configuration/${deleteTarget._id}`);
      setSingleDeleteOpen(false);
      setDeleteTarget(null);
      fetchAll();
      toast.success("Payee rate configuration deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Payee Rate Configuration</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAddRow}>
            Add Row
          </Button>
          <Button onClick={handleSaveAll}>Save All</Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Srno</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>ParentPayee</TableHead>
              <TableHead>Payee</TableHead>
              <TableHead>Rate List</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Loading />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No rows. Click "Add Row" to add one.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>

                  {/* Category Dropdown */}
                  <TableCell>
                    <Select
                      value={row.category || undefined}
                      onValueChange={(value) =>
                        handleRowChange(row.id, "category", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {payeeCategories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* ParentPayee Dropdown */}
                  <TableCell>
                    <Select
                      value={row.parentPayee || undefined}
                      onValueChange={(value) =>
                        handleRowChange(row.id, "parentPayee", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ParentPayee" />
                      </SelectTrigger>
                      <SelectContent>
                        {parentPayees.map((company) => (
                          <SelectItem key={company._id} value={company._id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Payee Dropdown */}
                  <TableCell>
                    <Select
                      value={row.payee || undefined}
                      onValueChange={(value) =>
                        handleRowChange(row.id, "payee", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Payee" />
                      </SelectTrigger>
                      <SelectContent>
                        {payees.map((p) => (
                          <SelectItem key={p._id} value={p._id}>
                            {p.name || "Unnamed"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Rate List Dropdown */}
                  <TableCell>
                    <Select
                      value={row.rateList || undefined}
                      onValueChange={(value) =>
                        handleRowChange(row.id, "rateList", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Rate List" />
                      </SelectTrigger>
                      <SelectContent>
                        {rateLists.map((rate) => (
                          <SelectItem key={rate._id} value={rate._id}>
                            {rate.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveRow(row.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={singleDeleteOpen} onOpenChange={setSingleDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payee Rate Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this configuration? This action
              cannot be undone.
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

export default PayeeRateConfigurationPage;
