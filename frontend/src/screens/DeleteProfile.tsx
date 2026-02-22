import { useState, type FC } from "react";
import { FormInput } from "../components";
import { buttonGeneric } from "../global.style";
import { LoaderCircle } from "lucide-react";
import { removeCacheData } from "../utilities";
import { useNavigate } from "react-router-dom";
import { processApiRequest } from "../apis";
import toast from "react-hot-toast";

export const DeleteProfile: FC = () => {
  /************ Variables ***************/
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /********** Variables *************/

  const handleDeleteUser = async (e: any) => {
    e.preventDefault();
    try {
      if (password !== cpassword)
        return toast.error("Password and Confirm Password doesn't match.");

      setLoading(true);
      const res = await processApiRequest(
        "DELETE",
        "/auth/delete-profile",
        {},
        { data: { password } }
      );
      if (res?.status) {
        removeCacheData("cloudProfile_user");
        navigate("/sign-up");
        window.location.reload();
      }
    } catch (error) {
      console.log("ERROR: Delete Profile ->", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center  px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Delete Your Profile
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Once deleted, your account cannot be restored.
            </p>
          </div>
          <form className="space-y-8">
            <FormInput
              id="password"
              type="password"
              placeholder="••••••••"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormInput
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              label="Confirm Password"
              value={cpassword}
              onChange={(e) => setCPassword(e.target.value)}
            />
            <button
              onClick={handleDeleteUser}
              disabled={loading}
              className={`${buttonGeneric} cursor-pointer w-full bg-red-700 hover:bg-red-600`}
            >
              Delete Profile
              {loading && (
                <LoaderCircle className="ml-2 animate-spin text-base" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
