import type { FC } from "react";
import type { FormButtonProps } from "../types";
import { buttonGeneric } from "../global.style";
import { LoaderCircle } from "lucide-react";

export const FormButton: FC<FormButtonProps> = ({
  label,
  disabled = false,
  loading = false,
  onClick,
}) => (
  <button
    disabled={disabled}
    type="submit"
    onClick={onClick}
    className={`mt-8 w-full ${buttonGeneric} ${
      disabled ? "cursor-not-allowed" : "cursor-pointer"
    }`}
  >
    {label}
    {loading && <LoaderCircle className="ml-2 animate-spin text-base" />}
  </button>
);
