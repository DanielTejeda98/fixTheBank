import { useAppSelector } from "@/redux/store";
import { ItemGroup } from "../../ui/item";
import PinTemplateCard from "./PinTemplateCard";
import {
  DrawerBody,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../../ui/drawer";

export default function ManagePinnedTemplates() {
  const templates = useAppSelector(
    (state) => state.budgetReducer.value.templates,
  );

  return (
    <div className="flex flex-wrap overflow-scroll">
      <DrawerHeader>
        <DrawerTitle>Pin Templates</DrawerTitle>
        <DrawerDescription>Pin templates for quick access</DrawerDescription>
      </DrawerHeader>
      <DrawerBody className="flex-col w-full">
        <ItemGroup className="gap-2">
          {templates.map((template) => (
            <PinTemplateCard key={template._id} template={template} />
          ))}
        </ItemGroup>
      </DrawerBody>
    </div>
  );
}
