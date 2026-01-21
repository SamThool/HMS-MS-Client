import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
// import { Input } from "@/components/ui/input";
// import { get, post } from "@/lib/api";
import { AlertCircle, FileText, History, Plus } from "lucide-react";
import React from "react";
import ChiefComplaintDrawer from "./ChiefComplaintDrawer";
import { useSelector } from "react-redux";

const chiefComplaint = ({ departmentId }) => {
  // const [complaints, setComplaints] = React.useState([]);
  // const [newComplaint, setNewComplaint] = React.useState("");
  // const [editingIndex, setEditingIndex] = React.useState(null);
  // const [editingValue, setEditingValue] = React.useState("");
  // const [adding, setAdding] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // const { patient } = useSelector((state) => state.patient);

  // const fetchComplaints = async () => {
  // const res = await get(`/chief-complaint-master/department/${departmentId}`);
  // setComplaints(res?.data?.complaints || []);
  // };

  // useEffect(() => {
  // fetchComplaints();
  // }, []);

  let historyData = [
    "Jan 15: Headache, fatigue",
    "Jan 10: Mild fever",
    "Dec 20: Cough",
  ];

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
                <AlertCircle className={`w-6 h-6 text-orange-500`} />
                Chief Complaints - Historical Data
              </DrawerTitle>
              <DrawerDescription>
                Past Chief Complaints records for patientData.name
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0 max-h-[400px] overflow-y-auto">
              <div className="space-y-3">
                {historyData.map((item, index) => (
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
                <Button variant="outline">Okay</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    );
  };

  const InfoDrawer = () => {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => setDrawerOpen(true)}
        >
          <FileText className="w-4 h-4 mr-2" />
          Take
        </Button>

        <ChiefComplaintDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          departmentId={departmentId}
        />
      </>
    );
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          <div className="flex-1">
            <CardTitle className="text-lg">Chief Complaints</CardTitle>
            <CardDescription className="text-xs">
              Primary patient concerns
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          Headache, fatigue for 3 days
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <InfoDrawer />
        <HistoryDrawer />
      </CardFooter>
    </Card>
  );
};

export default chiefComplaint;
