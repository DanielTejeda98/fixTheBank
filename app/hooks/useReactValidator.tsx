import { faWarning } from "@fortawesome/free-solid-svg-icons/faWarning";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import SimpleReactValidator from "simple-react-validator";

export default function useReactValidator () {
    const validator = useRef(new SimpleReactValidator({
        element: (message: string) => <div className="flex items-center gap-1 rounded-sm bg-red-500 text-xs text-white w-fit p-0.5">
            <FontAwesomeIcon icon={faWarning} /> 
            {message}
            </div>
    }));

    return validator;
}