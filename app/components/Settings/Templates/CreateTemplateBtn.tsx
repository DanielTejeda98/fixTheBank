"use client";
import { Button } from "../../ui/button";
import { useFTBDrawer } from "../../ui/ftbDrawer";
import TemplateEditor from "./TemplateEditor";

export default function CreateTemplateBtn() {
  const { setDrawerComponent, setOpen: setDrawerOpen } = useFTBDrawer();

  const handleCreateTemplate = () => {
    setDrawerComponent(<TemplateEditor />);
    setDrawerOpen(true);
  };

  return <Button onClick={handleCreateTemplate}>Create template</Button>;
}
