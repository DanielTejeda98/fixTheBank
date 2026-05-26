import {
  LucideArrowLeftRight,
  LucideBanknote,
  LucideDollarSign,
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { toSentenceCase } from "@/lib/utils";

export default function TemplateCardBadge({ type }: { type: string }) {
  switch (type) {
    case "income":
      return (
        <Badge variant="outline" className="border-green-500/30 text-green-700">
          <LucideBanknote />
          {toSentenceCase(type)}
        </Badge>
      );
    case "expense":
      return (
        <Badge variant="outline" className="bg-red-500/30 text-red-700">
          <LucideDollarSign /> {toSentenceCase(type)}
        </Badge>
      );
    case "transfer":
      return (
        <Badge variant="outline" className="bg-blue-500/30 text-blue-700">
          <LucideArrowLeftRight /> {toSentenceCase(type)}
        </Badge>
      );
    default:
      return null;
  }
}
