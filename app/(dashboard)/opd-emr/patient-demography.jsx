import React from "react";
import { User, Phone, Mail, MapPin, AlertCircle, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const PatientInfoCard = ({ patientData }) => {
  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">{patientData.name}</CardTitle>
              <CardDescription>Patient ID: {patientData.id}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="text-sm">
              Last Visit: {patientData.lastVisit}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Consultant: {patientData.physician}
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
            <p className="text-xs text-muted-foreground mb-1">Blood Group</p>
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
            <p className="text-xs text-muted-foreground mb-1">Admission Date</p>
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
              <p className="text-xs text-muted-foreground mb-1">Insurance</p>
              <p className="font-semibold text-sm">{patientData.insurance}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Allergies - Highlighted */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Known Allergies</p>
          <div className="flex flex-wrap gap-2">
            {patientData.allergies.split(", ").map((allergy, index) => (
              <Badge key={index} variant="destructive" className="text-xs">
                ⚠️ {allergy}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
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
  );
};

export default PatientInfoCard;
