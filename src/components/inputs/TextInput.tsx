import { classNames } from "~/utils/css";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { ReactNode } from "react";

interface Props {
  name?: string;
  id: string;
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  description?: string;
  cornerText?: string;
  leadingIcon?: ReactNode;
}

export default function TextInput({
  name,
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  type,
  disabled,
  autoComplete,
  className,
  description,
  cornerText,
  leadingIcon,
}: Props) {
  return (
    <div className="col-span-full">
      {cornerText ? (
        <label
          htmlFor={id}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
      ) : (
        <div className="flex justify-between">
          <label
            htmlFor={id}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {label}
          </label>
          <span
            className="text-sm leading-6 text-gray-500"
            id={`${id} -optional`}
          >
            {cornerText}
          </span>
        </div>
      )}
      <div
        className={classNames(
          "mt-2",
          error || leadingIcon ? "relative rounded-md shadow-sm" : ""
        )}
      >
        {leadingIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {leadingIcon}
          </div>
        )}
        <input
          type={type || "text"}
          name={name || id}
          id={id}
          className={classNames(
            "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
            className ?? ``,
            leadingIcon
              ? `block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`
              : ``,
            (error &&
              `block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6`) ??
              ``
          )}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
      {description && (
        <p className="mt-2 text-sm text-gray-500" id={`${id}-description`}>
          {description}
        </p>
      )}
    </div>
  );
}
