import { useAppSelector } from "@/redux/store";
import { useFTBDrawer } from "../../ui/ftbDrawer";
import AddIncome from "../../Dashboard/AddIncome";
import ExpenseEditor from "../../Dashboard/ExpenseEditor";
import TransferEditor from "../../Dashboard/TransferEditor";
import { TemplateView } from "@/types/budget";

export default function useCreateFromTemplate(template: TemplateView) {
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

  return handleCreateTransaction;
}
