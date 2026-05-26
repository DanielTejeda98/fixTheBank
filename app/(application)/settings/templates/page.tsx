import CreateTemplateBtn from "@/app/components/Settings/Templates/CreateTemplateBtn";
import TemplateList from "@/app/components/Settings/Templates/TemplateList";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default function TemplatesPage() {
  return (
    <div className="flex flex-col w-full p-2 gap-2">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-xl font-semibold">Manage templates</h1>
        <Link href="/settings">
          <Button variant={"ghost"}>Return to settings</Button>
        </Link>
      </div>
      <CreateTemplateBtn />
      <TemplateList />
    </div>
  );
}
