import { Loader2 } from "lucide-react";

export const LoaderScreen = () => (
  <div className="h-[70vh] flex items-center justify-center  px-4 py-12">
    <Loader2 className="animate-spin h-20 w-20 text-black dark:text-white" />
  </div>
);
