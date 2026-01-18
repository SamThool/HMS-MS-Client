// "use client";

// import * as React from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerDescription,
//   DrawerFooter,
// } from "@/components/ui/drawer";
// import { Separator } from "@/components/ui/separator";
// import { User, ClipboardList } from "lucide-react";

// /* -------------------- DATA -------------------- */

// const sections = [
//   "Vitals",
//   "Chief Complaints",
//   "Medical History",
//   "Examination",
//   "History",
//   "Prescription",
//   "Provisional Diagnosis",
//   "Final Diagnosis",
//   "Orders",
// ];

// /* -------------------- PAGE -------------------- */

// export default function Page() {
//   const [open, setOpen] = React.useState(false);
//   const [activeSection, setActiveSection] = React.useState("");

//   function openDrawer(section) {
//     setActiveSection(section);
//     setOpen(true);
//   }

//   return (
//     <div className="flex flex-col gap-6 p-4 md:p-6">
//       {/* ================= PATIENT INFO ================= */}
//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle className="flex items-center gap-2">
//             <User className="h-5 w-5" />
//             Patient Information
//           </CardTitle>
//           <CardDescription>OPD Encounter Details</CardDescription>
//         </CardHeader>

//         <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//           <Info label="Patient Name" value="Ramesh Kumar" />
//           <Info label="Age / Sex" value="45 / Male" />
//           <Info label="OPD No" value="OPD-10234" />
//           <Info label="Doctor" value="Dr. Sharma" />
//           <Info label="Visit Date" value="12 Sep 2026" />
//           <Info label="Department" value="General Medicine" />
//           <Info label="Mobile" value="+91 98765 43210" />
//           <Info label="Status" value="In Consultation" />
//         </CardContent>
//       </Card>

//       {/* ================= SECTIONS ================= */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
//         {sections.map((section) => (
//           <Card key={section} className="flex flex-col justify-between">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-base flex items-center gap-2">
//                 <ClipboardList className="h-4 w-4 text-muted-foreground" />
//                 {section}
//               </CardTitle>
//               <CardDescription className="text-xs">
//                 View or update {section.toLowerCase()}
//               </CardDescription>
//             </CardHeader>

//             <CardContent className="flex gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="w-1/2"
//                 onClick={() => openDrawer(section)}
//               >
//                 Get Info
//               </Button>
//               <Button
//                 size="sm"
//                 className="w-1/2"
//                 onClick={() => openDrawer(section + " History")}
//               >
//                 Get History
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* ================= DRAWER ================= */}
//       <Drawer open={open} onOpenChange={setOpen}>
//         <DrawerContent>
//           <div className="mx-auto w-full max-w-md">
//             <DrawerHeader>
//               <DrawerTitle>{activeSection}</DrawerTitle>
//               <DrawerDescription>
//                 Enter or review details for {activeSection}
//               </DrawerDescription>
//             </DrawerHeader>

//             <Separator />

//             {/* Drawer Body */}
//             <div className="p-4 text-sm space-y-2">
//               <p className="text-muted-foreground">
//                 This section will contain structured inputs, notes, charts,
//                 prescriptions, or orders related to:
//               </p>
//               <p className="font-medium">{activeSection}</p>

//               <div className="rounded-md border p-3 text-muted-foreground">
//                 Placeholder for form / history / data table
//               </div>
//             </div>

//             <DrawerFooter>
//               <Button>Save</Button>
//               <Button variant="outline" onClick={() => setOpen(false)}>
//                 Close
//               </Button>
//             </DrawerFooter>
//           </div>
//         </DrawerContent>
//       </Drawer>
//     </div>
//   );
// }

// /* -------------------- SMALL COMPONENT -------------------- */

// function Info({ label, value }) {
//   return (
//     <div className="flex flex-col">
//       <span className="text-muted-foreground text-xs">{label}</span>
//       <span className="font-medium">{value}</span>
//     </div>
//   );
// }

import React from "react";
import {
  User,
  Activity,
  FileText,
  Stethoscope,
  ClipboardList,
  Pill,
  AlertCircle,
  CheckCircle,
  FileCheck,
  History,
  Phone,
  Mail,
  MapPin,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

const PatientInfoPage = () => {
  const patientData = {
    name: "John Doe",
    id: "PT-2024-001",
    age: 45,
    gender: "Male",
    bloodGroup: "O+",
    contact: "+1 234-567-8900",
    email: "johndoe@email.com",
    address: "123 Main Street, Apt 4B, Springfield, IL 62701",
    emergencyContact: "Jane Doe (Spouse) - +1 234-567-8901",
    insurance: "Blue Cross Blue Shield - Policy #BC123456",
    physician: "Dr. Sarah Johnson",
    admissionDate: "Jan 15, 2026",
    lastVisit: "Jan 15, 2026",
    height: "5'10\"",
    weight: "180 lbs",
    bmi: "25.8",
    allergies: "Penicillin, Peanuts",
  };

  const medicalCards = [
    {
      id: "vitals",
      title: "Vitals",
      icon: Activity,
      description: "Monitor patient vital signs",
      color: "text-red-500",
      currentData: "BP: 120/80 mmHg, Pulse: 72 bpm",
      historyData: [
        "Jan 15: BP 118/78, Pulse 70",
        "Jan 10: BP 122/82, Pulse 74",
        "Jan 5: BP 120/80, Pulse 72",
      ],
    },
    {
      id: "complaints",
      title: "Chief Complaints",
      icon: AlertCircle,
      description: "Primary patient concerns",
      color: "text-orange-500",
      currentData: "Headache, fatigue for 3 days",
      historyData: [
        "Jan 15: Headache, fatigue",
        "Jan 10: Mild fever",
        "Dec 20: Cough",
      ],
    },
    {
      id: "medical-history",
      title: "Medical History",
      icon: FileText,
      description: "Past medical conditions",
      color: "text-blue-500",
      currentData: "Hypertension (2020), Diabetes Type 2 (2018)",
      historyData: [
        "Hypertension diagnosed 2020",
        "Diabetes Type 2 since 2018",
        "Appendectomy 2010",
      ],
    },
    {
      id: "examination",
      title: "Examination",
      icon: Stethoscope,
      description: "Physical examination findings",
      color: "text-green-500",
      currentData: "General: Alert and oriented. CVS: Normal S1, S2",
      historyData: [
        "Jan 15: Normal examination",
        "Jan 10: Mild tenderness abdomen",
        "Jan 5: Clear chest",
      ],
    },
    {
      id: "history",
      title: "History",
      icon: ClipboardList,
      description: "Patient history details",
      color: "text-purple-500",
      currentData: "Non-smoker, occasional alcohol, family history of HTN",
      historyData: [
        "Social: Non-smoker",
        "Family: HTN in father",
        "Allergies: Penicillin",
      ],
    },
    {
      id: "prescription",
      title: "Prescription",
      icon: Pill,
      description: "Current medications",
      color: "text-pink-500",
      currentData: "Metformin 500mg BD, Amlodipine 5mg OD",
      historyData: [
        "Current: Metformin, Amlodipine",
        "Previous: Lisinopril (discontinued)",
        "Jan 2025: Paracetamol PRN",
      ],
    },
    {
      id: "provisional",
      title: "Provisional Diagnosis",
      icon: FileCheck,
      description: "Initial diagnosis",
      color: "text-yellow-600",
      currentData: "Tension headache, possible migraine",
      historyData: [
        "Jan 15: Tension headache",
        "Jan 10: Viral gastroenteritis",
        "Dec 20: Upper respiratory infection",
      ],
    },
    {
      id: "final",
      title: "Final Diagnosis",
      icon: CheckCircle,
      description: "Confirmed diagnosis",
      color: "text-teal-500",
      currentData: "Migraine without aura",
      historyData: [
        "Jan 15: Migraine without aura",
        "Jan 10: Viral gastroenteritis",
        "Dec 20: Acute bronchitis",
      ],
    },
    {
      id: "orders",
      title: "Orders",
      icon: ClipboardList,
      description: "Medical orders and tests",
      color: "text-indigo-500",
      currentData: "CBC, LFT, RFT ordered. Follow-up in 1 week",
      historyData: [
        "Jan 15: CBC, LFT, RFT",
        "Jan 10: Stool culture",
        "Dec 20: Chest X-ray",
      ],
    },
  ];

  const InfoDrawer = ({ card }) => {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm" className="flex-1">
            <FileText className="w-4 h-4 mr-2" />
            Get Info
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-2xl">
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <card.icon className={`w-6 h-6 ${card.color}`} />
                {card.title} - Current Information
              </DrawerTitle>
              <DrawerDescription>
                Latest {card.title.toLowerCase()} data for {patientData.name}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h4 className="font-semibold mb-2">Current Data</h4>
                  <p className="text-sm text-muted-foreground">
                    {card.currentData}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last updated: {patientData.lastVisit}
                </div>
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    );
  };

  const HistoryDrawer = ({ card }) => {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm" className="flex-1">
            <History className="w-4 h-4 mr-2" />
            Get History
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-2xl">
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <card.icon className={`w-6 h-6 ${card.color}`} />
                {card.title} - Historical Data
              </DrawerTitle>
              <DrawerDescription>
                Past {card.title.toLowerCase()} records for {patientData.name}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0 max-h-[400px] overflow-y-auto">
              <div className="space-y-3">
                {card.historyData.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-3 bg-muted/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <p className="text-sm flex-1">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Patient Information Card */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{patientData.name}</CardTitle>
                  <CardDescription>
                    Patient ID: {patientData.id}
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="outline" className="text-sm">
                  Last Visit: {patientData.lastVisit}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Dr: {patientData.physician}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Primary Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Age</p>
                <p className="font-semibold">{patientData.age} years</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Gender</p>
                <p className="font-semibold">{patientData.gender}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Blood Group
                </p>
                <p className="font-semibold">{patientData.bloodGroup}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">BMI</p>
                <p className="font-semibold">{patientData.bmi}</p>
              </div>
            </div>

            <Separator />

            {/* Physical Measurements */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Height</p>
                <p className="font-semibold">{patientData.height}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Weight</p>
                <p className="font-semibold">{patientData.weight}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Admission Date
                </p>
                <p className="font-semibold">{patientData.admissionDate}</p>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Contact</p>
                  <p className="font-semibold text-sm">{patientData.contact}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="font-semibold text-sm break-all">
                    {patientData.email}
                  </p>
                </div>
              </div>
              <div className="md:col-span-2 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Address</p>
                  <p className="font-semibold text-sm">{patientData.address}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Emergency & Insurance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">
                    Emergency Contact
                  </p>
                  <p className="font-semibold text-sm">
                    {patientData.emergencyContact}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">
                    Insurance
                  </p>
                  <p className="font-semibold text-sm">
                    {patientData.insurance}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Allergies - Highlighted */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Known Allergies
              </p>
              <div className="flex flex-wrap gap-2">
                {patientData.allergies.split(", ").map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    ⚠️ {allergy}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm">
                Print
              </Button>

              <Button variant="outline" size="sm">
                History
              </Button>

              <Button size="sm">Button 1</Button>

              <Button size="sm">Button 2</Button>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medicalCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Card key={card.id} className="flex flex-col">
                <CardHeader className="">
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-5 h-5 ${card.color}`} />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {card.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {card.currentData}
                  </p>
                </CardContent>
                {/* <Separator /> */}
                <CardFooter className=" flex gap-2">
                  <InfoDrawer card={card} />
                  <HistoryDrawer card={card} />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PatientInfoPage;
