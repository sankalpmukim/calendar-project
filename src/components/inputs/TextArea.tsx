import { classNames } from "~/utils/css";

interface Props {
  name?: string;
  id: string;
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  description?: string;
}

export default function TextArea({
  name,
  id,
  label,
  placeholder,
  value,
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
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <textarea
          id={id}
          name={name ?? id}
          rows={3}
          className={classNames(
            "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
            (error && "ring-red-500 focus:ring-red-500") ?? ``,
            className ?? ``
          )}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          value={value}
        />
      </div>
      {description && (
        <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
      )}
    </div>
  );
}
