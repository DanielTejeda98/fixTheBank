"use client";

import { TemplateView } from "@/types/budget";
import TemplateCardBadge from "./TemplateCardBadge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "../../ui/item";
import { Button } from "../../ui/button";
import { LucidePin, LucidePinOff } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useState } from "react";
import { userPinTemplate, userUnpinTemplate } from "@/app/lib/budgetApi";

export default function PinTemplateCard({
  template,
}: {
  template: TemplateView;
}) {
  const [loading, setLoading] = useState(false);
  const isPinned = useAppSelector((state) =>
    state.budgetReducer.value.pinnedTemplates?.find(
      (temp) => temp === template._id,
    ),
  );

  const handlePinToggle = async () => {
    try {
      setLoading(true);
      if (isPinned) await userUnpinTemplate(template._id);
      else await userPinTemplate(template._id);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Item className="border rounded border-accent-foreground" size={"sm"}>
      <ItemContent className="flex-col items-start">
        <div className="flex gap-2 items-center">
          <TemplateCardBadge type={template.type} />
        </div>
        <ItemTitle>{template.name}</ItemTitle>
        <ItemDescription>{template.description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button onClick={handlePinToggle} disabled={loading} type="button">
          {isPinned ? <LucidePin size={16} /> : <LucidePinOff size={16} />}
        </Button>
      </ItemActions>
    </Item>
  );
}
