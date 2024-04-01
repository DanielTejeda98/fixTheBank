import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";

type ValidationType = {
    validator: any,
    data: any,
    validation: string
}

type InputProps = {
    id: string,
    name: string,
    type: "text" | "password" | "email",
    icon?: "faUser" | "faLock" | "faEnvelope",
    required?: boolean,
    label?: string,
    placeholder?: string,
    validation?: ValidationType,
    value?: string,
    onChange?: Function
}

const icons = {
    faUser,
    faLock,
    faEnvelope
}

function RenderLabel (id: string, labelText: string|undefined, required: boolean, info: string|null|undefined) {
    if (!labelText) {
        return null;
    }

    return (
        <>
            <label className="text-sm mb-2" htmlFor={id}>{labelText}</label>
            { !!required ? <span className="text-xs ml-1">*</span> : null }
            { !!info ? <span className="text-xs ml-1.5">{info}</span> : null }
        </>
    )
}

export default function Input({id, type = "text", icon = "faUser", name, required = false, label, placeholder, validation, value, onChange}: InputProps) {

    return (
        <div>
            {RenderLabel(id, label, required, null)}
            <div className="flex items-center border-2 border-solid rounded-md border-gray-500 mb-1 py-1.5 px-3">
                <FontAwesomeIcon icon={icons[icon]} />
                <input className="mx-2" 
                       type={type}
                       id={id} 
                       name={name} 
                       placeholder={placeholder} 
                       value={value} 
                       onChange={(e) => onChange && onChange(e.target.value)}/>
            </div>
            {
                !!validation ? validation.validator.current.message(name, validation.data, validation.validation) : null
            }
            
        </div>
    )
}