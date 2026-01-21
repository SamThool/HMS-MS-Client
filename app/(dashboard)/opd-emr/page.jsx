"use client";
import React from "react";
import {
  Activity,
  FileText,
  Stethoscope,
  ClipboardList,
  Pill,
  AlertCircle,
  CheckCircle,
  FileCheck,
  History,
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
import PatientInfoCard from "./patient-demography";
import ChiefComplaint from "./ChiefComplaint";
import { useSelector } from "react-redux";

const PatientInfoPage = () => {
  const { patient } = useSelector((state) => state.patient);

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
    // {
    //   id: "complaints",
    //   title: "Chief Complaints",
    //   icon: AlertCircle,
    //   description: "Primary patient concerns",
    //   color: "text-orange-500",
    //   currentData: "Headache, fatigue for 3 days",
    //   historyData: [
    //     "Jan 15: Headache, fatigue",
    //     "Jan 10: Mild fever",
    //     "Dec 20: Cough",
    //   ],
    // },
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
            Take
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
            History
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
    <div className="min-h-[90vh] bg-background p-4 md:p-6 lg:p-8">
      {patient ? (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Patient Information Card - Now a separate component */}
          <PatientInfoCard patientData={patientData} />

          {/* Medical Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ChiefComplaint departmentId={patient.appointment.department._id} />
            {medicalCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <Card key={card.id} className="flex flex-col">
                  <CardHeader>
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
                  <CardFooter className="flex gap-2">
                    <InfoDrawer card={card} />
                    <HistoryDrawer card={card} />
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="min-h-[80vh] bg-background flex items-center justify-center p-4">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">Please select a patient</h2>
            <p className="text-sm text-muted-foreground">
              Select a patient to view EMR
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientInfoPage;
