"use client";

import { useAppSelector } from "@/redux/store";
import TemplateListCard from "./TemplateListCard";

export default function TemplateList() {
  const templates = useAppSelector(
    (state) => state.budgetReducer.value.templates,
  );

  if (templates.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No templates created yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {templates.map((template) => (
        <TemplateListCard key={template._id} template={template} />
      ))}
    </div>
  );
}
