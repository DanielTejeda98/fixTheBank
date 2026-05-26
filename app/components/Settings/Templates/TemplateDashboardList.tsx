"use client";

import { useAppSelector } from "@/redux/store";
import CreateFromTemplateCard from "./CreateFromTemplateCard";
import { ItemGroup } from "../../ui/item";
import { Button } from "../../ui/button";
import { LucidePin } from "lucide-react";
import { useFTBDrawer } from "../../ui/ftbDrawer";
import ManagePinnedTemplates from "./ManagePinnedTemplates";
import { selectPinnedTemplates } from "@/redux/features/budget-slice";

export default function TemplateDashboardList() {
  const { setOpen, setDrawerComponent } = useFTBDrawer();
  const templates = useAppSelector(
    (state) => state.budgetReducer.value.templates,
  );
  const pinnedTemplates = useAppSelector(selectPinnedTemplates);

  const handleManagePinClick = () => {
    setDrawerComponent(<ManagePinnedTemplates />);
    setOpen(true);
  };

  if (templates.length === 0) return null;

  const displayTemplates =
    pinnedTemplates.length > 0 ? pinnedTemplates : templates.slice(0, 4);

  return (
    <section className="m-3 p-3 border">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h2>Quick create</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleManagePinClick}
          >
            <LucidePin size={16} />
          </Button>
        </div>
        <ItemGroup className="flex flex-row items-stretch overflow-x-auto gap-4">
          {displayTemplates.map((template) => (
            <CreateFromTemplateCard key={template._id} template={template} />
          ))}
        </ItemGroup>
      </div>
    </section>
  );
}
