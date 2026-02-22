import { CircleUserRound, PlugZap } from "lucide-react";
import type { FC } from "react";
import { NavLink } from "react-router-dom";
import type { LogoProps, SeparatorProps } from "../types";

export const Logo: FC<LogoProps> = ({ className, user }) => {
  return (
    <NavLink
      to={user ? "/" : "/login"}
      className={`flex title-font font-medium items-center text-indigo-400 ${className}`}
    >
      <PlugZap className="text-indog-400" />
      <span className="ml-3 text-lg">CloudProfile</span>
    </NavLink>
  );
};

export const UserAvatar = ({ name }: any) => {
  return (
    <div className="flex title-font font-medium items-center mb-2">
      <CircleUserRound className="text-indigo-300 h-6" />
      <span className="ml-2 text-lg text-gray-700 dark:text-gray-300">
        {name}
      </span>
    </div>
  );
};

export const Separator: FC<SeparatorProps> = ({ className }) => {
  return (
    <hr
      className={`w-full my-1 border-t border-dashed border-indigo-200 dark:border-gray-600 ${className}`}
    />
  );
};
