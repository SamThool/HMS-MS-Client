"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, LogIn, LogOut, Phone, Receipt, FileText } from "lucide-react";
import { get, post } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

export default function Page() {
  const [opds, setOpds] = useState([]);
  const isMobile = useIsMobile();

  const fetchOPD = async () => {
    try {
      const res = await get("/opd");
      setOpds(res.data || []);
    } catch {
      toast.error("Failed to load OPD patients");
    }
  };

  useEffect(() => {
    fetchOPD();
  }, []);

  const statusColor = (status) => {
    if (status === "wait") return "bg-yellow-500";
    if (status === "in") return "bg-blue-500";
    if (status === "out") return "bg-green-500";
  };

  const payColor = (status) => {
    if (status === "paid") return "text-green-600";
    if (status === "due") return "text-orange-600";
    return "text-red-600";
  };

  /* ---------------- MOBILE VIEW ---------------- */
  if (isMobile) {
    return (
      <div className="p-4 space-y-3">
        {opds.map((o) => (
          <Card key={o._id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{o.opdno}</p>
                  <p className="text-sm text-muted-foreground">
                    {o.patient?.fname} {o.patient?.lname}
                  </p>
                </div>
                <Badge className={statusColor(o.status)}>{o.status}</Badge>
              </div>

              <div className="flex justify-between text-sm">
                <span>Doctor</span>
                <span>
                  {o.appointment?.consultant?.firstName}{" "}
                  {o.appointment?.consultant?.lastName}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Payment</span>
                <span className={payColor(o.payStatus)}>
                  {o.payStatus.toUpperCase()}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                {o.status === "wait" && (
                  <Button size="sm" onClick={() => toast.info("Mark IN")}>
                    <LogIn className="h-4 w-4 mr-1" />
                    IN
                  </Button>
                )}

                {o.status === "in" && (
                  <Button size="sm" variant="outline">
                    <LogOut className="h-4 w-4 mr-1" />
                    OUT
                  </Button>
                )}

                <Button size="sm" variant="secondary">
                  <Eye className="h-4 w-4 mr-1" />
                  EMR
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  /* ---------------- DESKTOP TABLE ---------------- */
  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sr.</TableHead>
                <TableHead>UHID / OPD</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Dep / Con</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {opds.map((o, i) => (
                <TableRow key={o._id}>
                  <TableCell>{i + 1}</TableCell>
                  {/* IDs: UHID + OPD No */}
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>UHID: {o.patient?.uhid}</span>
                      <span className="text-xs text-muted-foreground">
                        OPD: {o.opdno}
                      </span>
                    </div>
                  </TableCell>

                  {/* Patient: Name + Phone */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">
                        {o.patient?.fname} {o.patient?.lname}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {o.patient?.mobileNumber || "-"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Department + Consultant */}
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>
                        {o.appointment?.department?.departmentName || "-"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Dr. {o.appointment?.consultant?.firstName}{" "}
                        {o.appointment?.consultant?.lastName}
                      </span>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>{o.category?.name || "-"}</TableCell>

                  {/* Payment */}
                  <TableCell
                    className={cn("font-medium", payColor(o.payStatus))}
                  >
                    {o.payStatus.toUpperCase()}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge className={statusColor(o.status)}>
                      {o.status.toUpperCase()}
                    </Badge>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right space-x-2">
                    {o.status === "wait" && (
                      <Button size="icon" variant="outline">
                        <LogIn className="h-4 w-4" />
                      </Button>
                    )}

                    {o.status === "in" && (
                      <Button size="icon" variant="outline">
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="outline">
                      <LogOut className="h-4 w-4" />
                    </Button>

                    <Button size="icon" variant="secondary">
                      <Receipt className="h-4 w-4" />
                    </Button>

                    <Button size="icon" variant="secondary">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {!opds.length && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No OPD patients
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
