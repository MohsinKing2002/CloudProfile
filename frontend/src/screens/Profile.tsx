import { useContext, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { buttonGeneric } from "../global.style";
import { Separator } from "../components";
import { AuthContext } from "../contexts/AuthContext";
import { formatDate, removeCacheData } from "../utilities";

const defaultImg =
  "https://cdn3d.iconscout.com/3d/premium/thumb/user-3d-icon-png-download-8988728.png";

export const ProfilePage: FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  console.log("INFO: profile", user);

  const handleLogOut = () => {
    removeCacheData("cloudProfile_user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-[#1F2937] p-8 rounded-xl shadow-lg">
          <div className="flex-shrink-0">
            <img
              className="h-32 w-32 rounded-full ring-2 ring-blue-500 object-cover bg-gray-300"
              src={user?.avatar ?? defaultImg}
              alt="User profile"
            />
          </div>
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {user?.name ?? "John Doe"}
            </h1>
            <p className="text-blue-500 dark:text-blue-400 mt-1">
              {user?.email ?? "john@example.com"}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-md">
              {user?.bio ?? "‼️ Bio not available ‼️"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 self-center md:self-start">
            <Link to={"/edit-profile"} className={`${buttonGeneric}`}>
              Edit Profile
            </Link>
            <button
              onClick={handleLogOut}
              className="bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white text-base font-medium border-0 p-3 px-5 focus:outline-none rounded-lg transition flex justify-center"
            >
              Logout
            </button>
            <Link
              to={"/delete-profile"}
              className={`${buttonGeneric} bg-red-700 hover:bg-red-600`}
            >
              Delete Profile
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-[#1F2937] p-8 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Account Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300 mb-8">
            <div>
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                Username:
              </span>{" "}
              {user?.username ?? "john01"}
            </div>
            <div>
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                Joined On:
              </span>{" "}
              {formatDate(user?.createdAt)}
            </div>
            <div>
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                Role:
              </span>{" "}
              User
            </div>
            <div>
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                Last Login:
              </span>{" "}
              Just now
            </div>
          </div>
          <Separator className="mb-6" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Your Feedback
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {user?.feedback?.text === ""
                ? "‼️ No Feedback recieved yet ‼️"
                : user?.feedback?.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
