"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Check, Trash2 } from "lucide-react";
import { post } from "@/lib/api";

const MasterSuggestionPills = ({
  title,
  field,
  values = [],
  departmentId,
  isEditing,
  onRefresh,
}) => {
  const [adding, setAdding] = React.useState(false);
  const [newValue, setNewValue] = React.useState("");
  const [editingIndex, setEditingIndex] = React.useState(null);
  const [editingValue, setEditingValue] = React.useState("");

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium">{title}</h4>
        {isEditing && (
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-400"
          >
            Editable
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {values.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1 rounded-full border px-3 py-1 text-sm bg-muted"
          >
            {editingIndex !== index ? (
              <>
                <span>{item}</span>

                {isEditing && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => {
                        setEditingIndex(index);
                        setEditingValue(item);
                      }}
                    >
                      <Pencil size={14} />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={async () => {
                        await post(
                          "/chief-complaint-master/suggestion/delete",
                          {
                            departmentId,
                            field,
                            value: item,
                          },
                        );
                        onRefresh?.();
                      }}
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Input
                  autoFocus
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  className="h-7 w-32 text-sm"
                />

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={async () => {
                    if (!editingValue.trim()) return;

                    await post("/chief-complaint-master/suggestion/update", {
                      departmentId,
                      field,
                      oldValue: item,
                      newValue: editingValue,
                    });

                    setEditingIndex(null);
                    setEditingValue("");
                    onRefresh?.();
                  }}
                >
                  <Check size={14} className="text-green-600" />
                </Button>
              </>
            )}
          </div>
        ))}

        {adding && isEditing && (
          <div className="flex items-center gap-1 rounded-full border px-3 py-1 bg-muted">
            <Input
              autoFocus
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="h-7 w-32 text-sm"
            />

            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={async () => {
                if (!newValue.trim()) return;

                await post("/chief-complaint-master/suggestion/add", {
                  departmentId,
                  field,
                  value: newValue,
                });

                setNewValue("");
                setAdding(false);
                onRefresh?.();
              }}
            >
              <Check size={14} className="text-green-600" />
            </Button>
          </div>
        )}

        {isEditing && (
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full"
            onClick={() => setAdding(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MasterSuggestionPills;
