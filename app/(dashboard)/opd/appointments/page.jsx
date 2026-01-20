"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Plus,
  Calendar as CalendarIcon,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { get, post } from "@/lib/api";
import { cn } from "@/lib/utils";
import { format, set } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ---------------- PAGE ---------------- */

export default function Page() {
  /* ---------------- STATE ---------------- */

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("new");

  const [appointments, setAppointments] = useState([]);

  const [uhids, setUhids] = useState([]);
  const [selectedUHID, setSelectedUHID] = useState("");

  const [departments, setDepartments] = useState([]);
  const [consultants, setConsultants] = useState([]);

  const [department, setDepartment] = useState("");
  const [consultant, setConsultant] = useState("");

  const [prefixes, setPrefixes] = useState([]);

  const [appointmentDate, setAppointmentDate] = useState();
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [dob, setDob] = useState();
  const [age, setAge] = useState("");

  const [arrivedOpen, setArrivedOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [category, setCategory] = useState("");
  const [parentPayee, setParentPayee] = useState("");
  const [payee, setPayee] = useState("");

  const [allCategory, setAllCategory] = useState([]);
  const [allParentPayee, setAllParentPayee] = useState([]);
  const [allPayee, setAllPayee] = useState([]);

  const [rateList, setRateList] = useState(false);

  const [form, setForm] = useState({
    prefix: "",
    fname: "",
    mname: "",
    lname: "",
    gender: "",
    mobileNumber: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    country: "India",
    maritalStatus: "",
  });

  /* ---------------- FETCH ---------------- */

  const fetchInitial = async () => {
    try {
      const [a, u, d, c, p, cat, gip, ins, gov, pub, pri, tpa] =
        await Promise.all([
          get("/appointment"),
          get("/uhid"),
          get("/department"),
          get("/users"),
          get("/prefix"),
          get("/payee-category"),
          get("/gipsaa-company"),
          get("/insurance-company"),
          get("/government-company"),
          get("/corporate-company-public"),
          get("/corporate-company-private"),
          get("/tpa"),
        ]);

      setAppointments(a || []);
      setUhids(u.data || []);
      setPrefixes(p || []);
      setDepartments(d || []);
      setConsultants(c?.data || []);
      setAllCategory(cat || []);
      setAllParentPayee([
        ...(gip ?? []),
        ...(ins ?? []),
        ...(gov ?? []),
        ...(pub ?? []),
        ...(pri ?? []),
      ]);
      setAllPayee(tpa ?? []);
    } catch {
      toast.error("Failed to load data");
    }
  };

  const fetchCityStateFromPincode = async (pincode) => {
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await res.json();

      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length) {
        return {
          city: data[0].PostOffice[0].District,
          state: data[0].PostOffice[0].State,
        };
      }
    } catch (err) {
      console.error("Pincode lookup failed", err);
    }

    return null;
  };

  /* ---------------- HELPERS ---------------- */

  const calculateAge = (date) => {
    const diff = Date.now() - date.getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  /* ---------------- SLOT FETCH (PLACEHOLDER) ---------------- */
  useEffect(() => {
    if (!consultant || !appointmentDate) return;

    // TODO: replace with doctor schedule API
    setSlots(["10:00-10:15", "10:15-10:30", "10:30-10:45"]);
  }, [consultant, appointmentDate]);

  useEffect(() => {
    // Do not call API until category is selected
    if (!category) return;

    const fetchPayeeRateConfig = async () => {
      try {
        const payload = {
          category,
          parentPayee: parentPayee || null,
          payee: payee || null,
        };

        const res = await post("/payee-rate-configuration/find", payload);

        if (res.success) {
          // console.log("Rate configuration found:", res.data);
          setRateList(true);
        } else {
          // console.log("No matching configuration");
          setRateList(false);
        }
      } catch (err) {
        console.error("Failed to fetch payee rate configuration", err);
      }
    };

    fetchPayeeRateConfig();
  }, [category, parentPayee, payee]);

  const handleSaveAppointment = async () => {
    if (!department || !consultant || !appointmentDate || !selectedSlot) {
      toast.error("Please complete appointment details");
      return;
    }

    let uhidToUse = selectedUHID;

    if (tab === "new") {
      const res = await post("/uhid", { ...form, dob });

      uhidToUse = res.data._id;
      setSelectedUHID(uhidToUse);

      setForm({
        prefix: "",
        fname: "",
        mname: "",
        lname: "",
        gender: "",
        mobileNumber: "",
        address: "",
        pincode: "",
        city: "",
        state: "",
        country: "India",
        maritalStatus: "",
      });
      setDob(null);
    }

    const payload = {
      uhid: uhidToUse,
      department,
      consultant,
      appointmentDate,
      slot: selectedSlot,
    };

    try {
      await post("/appointment", payload);
      setSelectedUHID("");
      setAppointmentDate(null);
      setSelectedSlot("");
      setConsultant("");
      setDepartment("");
      toast.success("Appointment booked");
      setOpen(false);
      fetchInitial();
    } catch {
      toast.error("Failed to book appointment");
    }
  };

  useEffect(() => {
    fetchInitial();
  }, []);
  return (
    <div className="p-4 space-y-4">
      {/* TABLE */}
      <Card className="p-4">
        <div className="flex justify-between mb-3">
          <h2 className="text-lg font-semibold">Appointments</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Make Appointment
              </Button>
            </DialogTrigger>

            <DialogContent className="w-[90vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Book Appointment</DialogTitle>
              </DialogHeader>

              {/* TABS */}
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                  <TabsTrigger value="new">New</TabsTrigger>
                  <TabsTrigger value="existing">Follow-Up</TabsTrigger>
                </TabsList>

                {/* NEW PATIENT */}
                <TabsContent value="new">
                  <div className="grid grid-cols-12 gap-4">
                    {/* Row 1: Prefix | First Name | Last Name */}
                    <div className="col-span-12 sm:col-span-2">
                      <Select
                        value={form.prefix}
                        onValueChange={(v) => setForm({ ...form, prefix: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Prefix" />
                        </SelectTrigger>
                        <SelectContent>
                          {prefixes.map((p) => (
                            <SelectItem key={p._id} value={p._id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-12 sm:col-span-5">
                      <Input
                        placeholder="First Name"
                        value={form.fname}
                        onChange={(e) =>
                          setForm({ ...form, fname: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-5">
                      <Input
                        placeholder="Last Name"
                        value={form.lname}
                        onChange={(e) =>
                          setForm({ ...form, lname: e.target.value })
                        }
                      />
                    </div>

                    {/* Row 2: Middle Name | Mobile | Country */}
                    <div className="col-span-12 sm:col-span-4">
                      <Input
                        placeholder="Middle Name"
                        value={form.mname}
                        onChange={(e) =>
                          setForm({ ...form, mname: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-4">
                      <Input
                        placeholder="Mobile Number"
                        value={form.mobileNumber}
                        onChange={(e) =>
                          setForm({ ...form, mobileNumber: e.target.value })
                        }
                        inputMode="numeric"
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-4">
                      <Input
                        placeholder="Country"
                        value={form.country}
                        onChange={(e) =>
                          setForm({ ...form, country: e.target.value })
                        }
                      />
                    </div>

                    {/* DOB */}
                    <div className="col-span-12 sm:col-span-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left",
                              !dob && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dob ? format(dob, "dd/MM/yyyy") : "Date of Birth"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Calendar
                            mode="single"
                            selected={dob}
                            onSelect={(date) => {
                              setDob(date);
                              setAge(calculateAge(date));
                            }}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Age */}
                    <div className="col-span-12 sm:col-span-2">
                      <Input placeholder="Age" value={age} disabled />
                    </div>

                    {/* Gender */}
                    <div className="col-span-12 sm:col-span-3 flex items-center">
                      <RadioGroup
                        className="flex gap-4"
                        value={form.gender}
                        onValueChange={(v) => setForm({ ...form, gender: v })}
                      >
                        {["male", "female", "other"].map((g) => (
                          <div key={g} className="flex items-center gap-2">
                            <RadioGroupItem value={g} />
                            <span className="text-sm capitalize text-muted-foreground">
                              {g}
                            </span>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Marital Status */}
                    <div className="col-span-12 sm:col-span-4">
                      <Select
                        value={form.maritalStatus}
                        onValueChange={(v) =>
                          setForm({ ...form, maritalStatus: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Marital Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Single",
                            "Married",
                            "Divorced",
                            "Widowed",
                            "Separated",
                          ].map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Row 4: Pincode | City | State */}
                    <div className="col-span-12 sm:col-span-4">
                      <Input
                        placeholder="Pincode"
                        value={form.pincode}
                        onChange={async (e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setForm({ ...form, pincode: value });

                          if (value.length === 6) {
                            const location =
                              await fetchCityStateFromPincode(value);
                            if (location) {
                              setForm((prev) => ({
                                ...prev,
                                city: location.city,
                                state: location.state,
                              }));
                            }
                          }
                        }}
                        inputMode="numeric"
                        maxLength={6}
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-4">
                      <Input
                        placeholder="City"
                        disabled
                        value={form.city}
                        onChange={(e) =>
                          setForm({ ...form, city: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-4">
                      <Input
                        disabled
                        placeholder="State"
                        value={form.state}
                        onChange={(e) =>
                          setForm({ ...form, state: e.target.value })
                        }
                      />
                    </div>

                    {/* Row 5: Address (full width) */}
                    <div className="col-span-12">
                      <Input
                        placeholder="Address"
                        value={form.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* EXISTING */}
                <TabsContent value="existing">
                  <Select value={selectedUHID} onValueChange={setSelectedUHID}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select UHID" />
                    </SelectTrigger>
                    <SelectContent>
                      {uhids.map((u) => (
                        <SelectItem key={u._id} value={u._id}>
                          {u.uhid} – {u.fname} {u.lname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TabsContent>
              </Tabs>

              {/* COMMON SECTION */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d._id} value={d._id}>
                        {d.departmentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={consultant} onValueChange={setConsultant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Consultant" />
                  </SelectTrigger>
                  <SelectContent>
                    {consultants.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.employeeCode} {c.firstName} {c.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {appointmentDate
                        ? format(appointmentDate, "dd/MM/yyyy")
                        : "Appointment Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={appointmentDate}
                      onSelect={setAppointmentDate}
                    />
                  </PopoverContent>
                </Popover>

                <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {slots.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveAppointment}>
                  Book Appointment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={arrivedOpen} onOpenChange={setArrivedOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Mark Patient as Arrived</DialogTitle>
            </DialogHeader>

            {selectedAppointment && (
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Patient:</span>{" "}
                  {selectedAppointment.uhid?.fname}{" "}
                  {selectedAppointment.uhid?.lname}
                </p>
                <p>
                  <span className="text-muted-foreground">Doctor:</span>{" "}
                  {selectedAppointment.consultant?.firstName}{" "}
                  {selectedAppointment.consultant?.lastName}
                </p>
                <p>
                  <span className="text-muted-foreground">Slot:</span>{" "}
                  {selectedAppointment.slot}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              {/* Category */}
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategory.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Parent Payee */}
              <Select value={parentPayee} onValueChange={setParentPayee}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Parent Payee" />
                </SelectTrigger>
                <SelectContent>
                  {allParentPayee.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Payee */}
              <Select value={payee} onValueChange={setPayee}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Payee" />
                </SelectTrigger>
                <SelectContent>
                  {allPayee.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {category && (
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
                    rateList
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700",
                  )}
                >
                  {rateList ? "✓ Rate List Available" : "✕ Rate List Not Found"}
                </span>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setArrivedOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={!rateList}
                onClick={async () => {
                  try {
                    if (!selectedAppointment) return;

                    const payload = {
                      patient: selectedAppointment.uhid?._id,
                      appointment: selectedAppointment._id,
                      category,
                      parentPayee: parentPayee || null,
                      payee: payee || null,
                    };

                    const res = await post("/opd", payload);
                    console.log(res);

                    toast.success("Patient arrived & OPD created");

                    setArrivedOpen(false);
                    fetchInitial();
                  } catch (err) {
                    console.error(err);
                    toast.error("Failed to create OPD");
                  }
                }}
              >
                Confirm Arrived
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* APPOINTMENT TABLE */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr.</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Slot</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {appointments.map((a, i) => (
              <TableRow key={a._id}>
                <TableCell>{i + 1}.</TableCell>
                <TableCell>
                  {a.uhid?.fname} {a.uhid?.mname} {a.uhid?.lname}
                </TableCell>
                <TableCell>
                  {a.consultant?.firstName} {a.consultant?.lastName}
                </TableCell>
                <TableCell>{a.department?.departmentName}</TableCell>
                <TableCell>
                  {format(new Date(a.appointmentDate), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>{a.slot}</TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <div className="flex items-center justify-end gap-2">
                      {/* Arrived */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setSelectedAppointment(a);
                              setArrivedOpen(true);
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          Mark as Arrived
                        </TooltipContent>
                      </Tooltip>

                      {/* Delete */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
