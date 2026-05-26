"use client";

import { useFTBDrawer } from "../../ui/ftbDrawer";
import { TemplateView } from "@/types/budget";
import TemplateCardBadge from "./TemplateCardBadge";
import { Item, ItemDescription, ItemHeader, ItemTitle } from "../../ui/item";
import ExpenseEditor from "../../Dashboard/ExpenseEditor";
import { useAppSelector } from "@/redux/store";
import AddIncome from "../../Dashboard/AddIncome";
import TransferEditor from "../../Dashboard/TransferEditor";

export default function CreateFromTemplateCard({
  template,
}: {
  template: TemplateView;
}) {
  const budgetId = useAppSelector((state) => state.budgetReducer.value._id);
  const { setOpen: setDrawerOpen, setDrawerComponent } = useFTBDrawer();

  const handleCreateTransaction = () => {
    switch (template.type) {
      case "income":
        setDrawerComponent(
          <AddIncome budgetId={budgetId} templateData={template.data} />,
        );
        break;
      case "expense":
        setDrawerComponent(
          <ExpenseEditor
            isFromTemplate={true}
            transaction={template.data}
            budgetId={budgetId}
          />,
        );
        break;
      case "transfer":
        setDrawerComponent(
          <TransferEditor
            isFromTemplate={true}
            transaction={{
              ...template.data,
              account: template.data.savingsAccount,
              bucket: template.data.savingsBucket,
            }}
          />,
        );
        break;
      default:
        return;
    }
    setDrawerOpen(true);
  };

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
