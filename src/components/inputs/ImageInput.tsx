{
  /*  */
}

import { classNames } from "~/utils/css";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

interface Props {
  name?: string;
  id: string;
  label: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  description?: string;
}

export default function ImageInput({
  name,
  id,
  label,
  onChange,
  error,
  disabled,
  autoComplete,
  className,
  description,
}: Props) {
  return (
    <div className="col-span-full">
      <label
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="mt-2 flex items-center gap-x-3">
        <UserCircleIcon
          className="h-12 w-12 text-gray-300"
          aria-hidden="true"
        />
        <input
          className={classNames(
            "block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400",
            (error &&
              "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500") ??
              ``,
            className ?? ``
          )}
          aria-describedby="file_input_help"
          id={id}
          type="file"
          name={name ?? id}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          placeholder={label}
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

      {description && (
        <p
          className="mt-1 text-sm text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          {description}
        </p>
      )}
    </div>
  );
}
