import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TransactionViewerDetailsLineProps {
    icon: IconProp;
    label: string;
    details: string;
}

export default function TransactionViewerDetailsLine(
    {
        icon,
        label,
        details
    }: TransactionViewerDetailsLineProps
) {
    return (
        <>
            <div className="flex items-center">
                <div className="flex rounded size-8 items-center justify-center">
                    <FontAwesomeIcon icon={icon} />
                </div>
                <span>{label}</span>
            </div>
            <span className="flex items-center">{details}</span>
        </>
    )
}