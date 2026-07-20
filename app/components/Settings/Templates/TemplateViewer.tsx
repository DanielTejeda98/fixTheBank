import { useAppSelector } from "@/redux/store";
import { Button } from "../../ui/button";
import {
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../../ui/drawer";
import { useFTBDrawer } from "../../ui/ftbDrawer";
import TemplateEditor from "./TemplateEditor";
import {
  selectAccounts,
  selectCategories,
} from "@/redux/features/budget-slice";
import useCreateFromTemplate from "./useCreateFromTemplate";
import { TemplateView } from "@/types/budget";
import TransactionViewerDetailsLine from "../../Transactions/TransactionViewerDetailsLine";
import { LucideClock } from "lucide-react";
import {
  faCalendar,
  faClock,
  faCreditCard,
  faIdBadge,
  faNewspaper,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBank,
  faBucket,
  faCancel,
  faDollarSign,
  faGear,
  faList,
  faPoundSign,
} from "@fortawesome/free-solid-svg-icons";
import { formatDateDisplay } from "@/app/lib/renderHelper";

const iconDictionary = {
  type: faGear,
  amount: faDollarSign,
  name: faIdBadge,
  description: faNewspaper,
};

export default function TemplateViewer({ templateId }: { templateId: string }) {
  const { setDrawerComponent } = useFTBDrawer();
  const templateData = useAppSelector((state) =>
    state.budgetReducer.value.templates.find((t) => t._id === templateId),
  );
  const savingsAccount = useAppSelector(
    (state) => state.savingsReducer.value.savingsAccounts,
  ).find((sa) => sa._id === templateData?.data?.savingsAccount);
  const category =
    useAppSelector(selectCategories).find(
      (cat) => cat._id === templateData?.data?.category,
    )?.name || "";
  const account =
    useAppSelector(selectAccounts).find(
      (acc) => acc._id === templateData?.data?.account,
    )?.name || "";
  const createFromTemplate = useCreateFromTemplate(
    templateData ?? ({} as TemplateView),
  );

  const handleCreateFromTemplate = () => {
    if (!templateData) return;

    createFromTemplate();
  };

  const handleEditTemplate = () => {
    setDrawerComponent(<TemplateEditor templateId={templateId} />);
  };

  const renderTemplateData = () => {
    const templateTransactionData = templateData?.data;
    if (!templateTransactionData) return null;
    const keys = Object.keys(templateTransactionData);

    return (
      <div className="grid grid-cols-2 border-t w-full pt-2">
        <p className="col-span-2 text-md font-semibold">Transaction Data</p>

        {keys.map((key) => {
          switch (key) {
            case "account":
              return (
                <TransactionViewerDetailsLine
                  icon={faCreditCard}
                  label="Account"
                  details={account}
                />
              );
            case "category":
              return (
                <TransactionViewerDetailsLine
                  icon={faList}
                  label="Category"
                  details={category}
                />
              );
            case "savingsAccount":
              return (
                <TransactionViewerDetailsLine
                  icon={faBank}
                  label="Savings Account"
                  details={savingsAccount?.name || ""}
                />
              );
            case "savingsBucket":
              return (
                <TransactionViewerDetailsLine
                  icon={faBucket}
                  label="Bucket"
                  details={
                    savingsAccount?.buckets.find(
                      (bkt) =>
                        bkt._id === templateTransactionData.savingsBucket,
                    )?.name || ""
                  }
                />
              );
            default:
              return (
                <TransactionViewerDetailsLine
                  icon={
                    iconDictionary[key as keyof typeof iconDictionary] ?? faUser
                  }
                  label={key}
                  details={templateTransactionData[key]}
                />
              );
          }
        })}
      </div>
    );
  };

  const renderRecurringSettingsSection = () => {
    const recurringSettings = templateData?.recurringSettings;

    if (!recurringSettings) return null;

    return (
      <div className="grid grid-cols-2 border-t w-full pt-2">
        <p className="col-span-2 text-md font-semibold">Reocurring Settings</p>
        {recurringSettings?.frequency && (
          <TransactionViewerDetailsLine
            icon={faClock}
            label="Reoccuring"
            details={recurringSettings.frequency}
          />
        )}
        {recurringSettings?.endCondition && (
          <TransactionViewerDetailsLine
            icon={faCancel}
            label="End Condition"
            details={recurringSettings.endCondition}
          />
        )}
        {recurringSettings?.endDate && (
          <TransactionViewerDetailsLine
            icon={faCalendar}
            label="End Date"
            details={formatDateDisplay(recurringSettings.endDate)}
          />
        )}
        {recurringSettings?.occurrences && (
          <TransactionViewerDetailsLine
            icon={faPoundSign}
            label="Occurances"
            details={recurringSettings.occurrences.toString()}
          />
        )}
      </div>
    );
  };
  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Template: {templateData?.name || "N/A"}</DrawerTitle>
        <DrawerDescription>{templateData?.description || ""}</DrawerDescription>
      </DrawerHeader>
      <DrawerBody>
        <div className="w-full flex gap-2 flex-col">
          {renderTemplateData()}
          {renderRecurringSettingsSection()}
        </div>
      </DrawerBody>
      <DrawerFooter className="w-full">
        <div className="flex justify-end gap-3 w-full mt-5">
          <Button
            type="button"
            variant={"secondary"}
            onClick={handleEditTemplate}
          >
            Edit template
          </Button>
          <Button type="button" onClick={handleCreateFromTemplate}>
            Create from Template
          </Button>
        </div>
      </DrawerFooter>
    </>
  );
}
