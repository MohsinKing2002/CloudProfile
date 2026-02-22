import type { FC } from "react";
import type { FormInputProps } from "../types";

const inputStyle =
  "w-full px-4 py-2 rounded-md bg-gray-200 dark:bg-[#374151] border border-gray-300 dark:border-[#4B5563] text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200";

export const FormInput: FC<FormInputProps> = ({
  id,
  type,
  placeholder,
  label,
  isTextarea = false,
  value,
  onChange,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      {label}
    </label>
    {isTextarea ? (
      <textarea
        name={id}
        id={id}
        placeholder={placeholder}
        className={inputStyle}
        value={value}
        onChange={onChange}
      ></textarea>
    ) : (
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className={inputStyle}
        value={value}
        onChange={onChange}
        required
      />
    )}
  </div>
);
