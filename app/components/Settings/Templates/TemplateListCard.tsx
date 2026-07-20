"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { LucideCalendar, LucideClock } from "lucide-react";
import { useFTBDrawer } from "../../ui/ftbDrawer";
import { TemplateView } from "@/types/budget";
import TemplateCardBadge from "./TemplateCardBadge";
import TemplateViewer from "./TemplateViewer";

export default function TemplateListCard({
  template,
}: {
  template: TemplateView;
}) {
  const { setOpen: setDrawerOpen, setDrawerComponent } = useFTBDrawer();

  const handleEditTemplate = (templateId: string) => {
    setDrawerComponent(<TemplateViewer templateId={templateId} />);
    setDrawerOpen(true);
  };

  return (
    <button
      key={template._id}
      className="w-full text-left"
      onClick={() => handleEditTemplate(template._id)}
    >
      <Card>
        <CardHeader>
          <div className="flex gap-2 mb-2">
            <TemplateCardBadge type={template.type} />
          </div>
          <CardTitle>{template.name}</CardTitle>
          <CardDescription>{template.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {template.recurringSettings?.frequency && (
              <div className="flex gap-2 items-center text-sm">
                <LucideClock className="size-4 text-muted-foreground" />{" "}
                Reoccuring {template.recurringSettings?.frequency}
              </div>
            )}
            {template.recurringSettings?.endCondition && (
              <div className="flex gap-2 items-center text-sm">
                <LucideCalendar className="size-4 text-muted-foreground" /> Ends{" "}
                {template.recurringSettings?.endCondition}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
