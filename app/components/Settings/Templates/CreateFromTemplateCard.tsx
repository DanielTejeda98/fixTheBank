"use client";

import { TemplateView } from "@/types/budget";
import TemplateCardBadge from "./TemplateCardBadge";
import { Item, ItemDescription, ItemHeader, ItemTitle } from "../../ui/item";
import useCreateFromTemplate from "./useCreateFromTemplate";

export default function CreateFromTemplateCard({
  template,
}: {
  template: TemplateView;
}) {
  const handleCreateTransaction = useCreateFromTemplate(template);

  return (
    <button
      key={template._id}
      className="w-full min-w-1/2 lg:min-w-1/3 text-left border border-dashed border-muted-foreground rounded flex items-start"
      onClick={() => handleCreateTransaction()}
    >
      <Item>
        <ItemHeader className="flex-col items-start">
          <div className="flex gap-2 items-center">
            <TemplateCardBadge type={template.type} />
          </div>
          <ItemTitle>{template.name}</ItemTitle>
          <ItemDescription>{template.description}</ItemDescription>
        </ItemHeader>
      </Item>
    </button>
  );
}
