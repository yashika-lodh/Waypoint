"use client";

import { useAgentStore } from "@/store/useAgentStore";
import { useState } from "react";

export function PlanEditor() {
  const { plan, updateStep, deleteStep, setRunState } = useAgentStore();

  if (!plan) return null;

  function handleApprove() {
    setRunState("executing"); // Point 4 picks up from here
  }

  return (
    <div className="w-full max-w-xl flex flex-col gap-3">
      <h2 className="text-lg font-medium">Review the plan</h2>

      {plan.steps.map((step) => (
        <StepRow
          key={step.id}
          id={step.id}
          title={step.title}
          description={step.description}
          onUpdate={(updates) => updateStep(step.id, { ...updates, editedByUser: true })}
          onDelete={() => deleteStep(step.id)}
        />
      ))}

      <button
        onClick={handleApprove}
        disabled={plan.steps.length === 0}
        className="bg-black text-white rounded-md px-4 py-2 mt-2 disabled:opacity-50"
      >
        Approve Plan
      </button>
    </div>
  );
}

function StepRow({
  title,
  description,
  onUpdate,
  onDelete,
}: {
  id: string;
  title: string;
  description: string;
  onUpdate: (updates: { title?: string; description?: string }) => void;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const [localDescription, setLocalDescription] = useState(description);

  function handleSave() {
    onUpdate({ title: localTitle, description: localDescription });
    setIsEditing(false);
  }

  function handleCancel() {
    setLocalTitle(title);
    setLocalDescription(description);
    setIsEditing(false);
  }

  return (
    <div className="border rounded-md p-3">
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            className="border rounded px-2 py-1 font-medium"
          />
          <textarea
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            rows={2}
            className="border rounded px-2 py-1 text-sm resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="text-sm bg-black text-white rounded px-3 py-1"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="text-sm border rounded px-3 py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start gap-3">
          <div>
            <strong>{title}</strong>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-gray-500 hover:text-black"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}