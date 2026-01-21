import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  // DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  AlertCircle,
  // FileText,
  Pencil,
  // Plus,
  Save,
  // Trash2,
} from "lucide-react";
import { get, post } from "@/lib/api";
// import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
import MasterSuggestionPills from "./components/MasterSuggestionPills";

const ChiefComplaintDrawer = ({ open, onOpenChange, departmentId }) => {
  // const [complaints, setComplaints] = React.useState([]);

  const [master, setMaster] = React.useState({
    complaints: [],
    locations: [],
    descriptions: [],
    since: [],
    treatments: [],
    with: [],
  });

  // const [adding, setAdding] = React.useState(false);
  // const [newComplaint, setNewComplaint] = React.useState("");
  // const [editingIndex, setEditingIndex] = React.useState(null);
  // const [editingValue, setEditingValue] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);

  const fetchMaster = async () => {
    const res = await get(`/chief-complaint-master/department/${departmentId}`);
    // setComplaints(res?.data?.complaints || []);
    setMaster(res?.data || {});
  };

  React.useEffect(() => {
    if (open) fetchMaster();
  }, [open, departmentId]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-full sm:max-w-3xl px-2 sm:px-4 flex flex-col h-full">
          <DrawerHeader className="flex flex-row items-center justify-between">
            {/* Left side */}
            <DrawerTitle className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              Chief Complaints
            </DrawerTitle>

            {/* Right side – Edit */}

            <div className="flex items-center gap-3">
              {/* Editing mode indicator */}
              {isEditing && (
                <Badge
                  variant="outline"
                  className="text-orange-600 border-orange-400"
                >
                  Editing mode ON
                </Badge>
              )}

              {/* Edit / Save button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsEditing((prev) => !prev)}
              >
                {isEditing ? (
                  <Save className="w-4 h-4 text-green-600" />
                ) : (
                  <Pencil className="w-4 h-4" />
                )}
              </Button>
            </div>
          </DrawerHeader>
          {/* <div className="p-4 pb-0">
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h4 className="font-semibold mb-2">Current Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Headache, fatigue for 3 days
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last updated: patientData.lastVisit
                </div>
              </div>
            </div> */}
          {/* <div className="px-4 py-2 space-y-3">
            <div className="px-4 py-2 space-y-3"></div>
          </div> */}

          <Tabs defaultValue="complaints" className="w-full">
            {/* Tabs */}
            <TabsList
              className="
    w-full h-12 px-2
    flex items-center justify-start gap-2
    overflow-x-auto
    scrollbar-hide
    scroll-smooth
    snap-x snap-mandatory
    overscroll-x-contain
    sm:grid sm:grid-cols-6
  "
            >
              <TabsTrigger
                className="
  flex-none
  whitespace-nowrap
  min-w-[120px]
  snap-start
  transition-colors
  duration-200
"
                value="complaints"
              >
                Complaints
              </TabsTrigger>
              <TabsTrigger
                className="
  flex-none
  whitespace-nowrap
  min-w-[120px]
  snap-start
  transition-colors
  duration-200
"
                value="location"
              >
                Location
              </TabsTrigger>
              <TabsTrigger
                className="
  flex-none
  whitespace-nowrap
  min-w-[120px]
  snap-start
  transition-colors
  duration-200
"
                value="description"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                className="
  flex-none
  whitespace-nowrap
  min-w-[120px]
  snap-start
  transition-colors
  duration-200
"
                value="since"
              >
                Since
              </TabsTrigger>
              <TabsTrigger
                className="
  flex-none
  whitespace-nowrap
  min-w-[120px]
  snap-start
  transition-colors
  duration-200
"
                value="treatment"
              >
                Treatment
              </TabsTrigger>
              <TabsTrigger
                className="
  flex-none
  whitespace-nowrap
  min-w-[120px]
  snap-start
  transition-colors
  duration-200
"
                value="with"
              >
                With
              </TabsTrigger>
            </TabsList>

            {/* Location */}
            <div className="flex-1 overflow-hidden">
              <TabsContent
                value="complaints"
                className="
    mt-4 space-y-2
    max-h-[40vh]
    overflow-y-auto
    pr-1
  "
              >
                <MasterSuggestionPills
                  title="Chief Complaints"
                  field="complaints"
                  values={master.complaints}
                  departmentId={departmentId}
                  isEditing={isEditing}
                  onRefresh={fetchMaster}
                />
              </TabsContent>
            </div>
            <TabsContent
              value="location"
              className="
    mt-4 space-y-2
    max-h-[40vh]
    overflow-y-auto
    pr-1
  "
            >
              {/* <Label>Location</Label> */}
              <MasterSuggestionPills
                title="Location"
                field="locations"
                values={master.locations}
                departmentId={departmentId}
                isEditing={isEditing}
                onRefresh={fetchMaster}
              />
            </TabsContent>

            <TabsContent
              value="description"
              className="
    mt-4 space-y-2
    max-h-[40vh]
    overflow-y-auto
    pr-1
  "
            >
              {/* <Label>Description</Label> */}
              <MasterSuggestionPills
                title="Description"
                field="descriptions"
                values={master.descriptions}
                departmentId={departmentId}
                isEditing={isEditing}
                onRefresh={fetchMaster}
              />
            </TabsContent>

            <TabsContent
              value="since"
              className="
    mt-4 space-y-2
    max-h-[40vh]
    overflow-y-auto
    pr-1
  "
            >
              {/* <Label>Since</Label> */}
              <MasterSuggestionPills
                title="Since"
                field="since"
                values={master.since}
                departmentId={departmentId}
                isEditing={isEditing}
                onRefresh={fetchMaster}
              />
            </TabsContent>

            <TabsContent
              value="treatment"
              className="
    mt-4 space-y-2
    max-h-[40vh]
    overflow-y-auto
    pr-1
  "
            >
              {/* <Label>Treatment</Label> */}
              <MasterSuggestionPills
                title="Treatment"
                field="treatments"
                values={master.treatments}
                departmentId={departmentId}
                isEditing={isEditing}
                onRefresh={fetchMaster}
              />
            </TabsContent>

            <TabsContent
              value="with"
              className="
    mt-4 space-y-2
    max-h-[40vh]
    overflow-y-auto
    pr-1
  "
            >
              {/* <Label>Associated With</Label> */}
              <MasterSuggestionPills
                title="Associated With"
                field="with"
                values={master.with}
                departmentId={departmentId}
                isEditing={isEditing}
                onRefresh={fetchMaster}
              />
            </TabsContent>
          </Tabs>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" onClick={onOpenChange}>
                Okay
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ChiefComplaintDrawer;
