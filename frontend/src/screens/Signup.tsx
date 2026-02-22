import { useState, type FC } from "react";
import { FormButton, FormInput } from "../components";
import { Link, useNavigate } from "react-router-dom";
import type { SignUpProps } from "../types";
import { setCacheWithExpiry } from "../utilities";
import toast from "react-hot-toast";
import { processApiRequest } from "../apis";

export const SignupPage: FC = () => {
  /********** Variables *************/
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [signupData, setSignupData] = useState<SignUpProps>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });

  /********** Variables *************/

  const handleUserSignUp = async (e: any) => {
    e.preventDefault();

    if (signupData.password.length < 6)
      return toast.error("Password length should be atleast 6 characters!");
    if (signupData.password !== signupData.confirmPassword)
      return toast.error("Password and Confirm Passwords doesn't match!");

    setLoading(true);
    try {
      const res = await processApiRequest("POST", "/auth/register", signupData);
      if (res?.status) {
        setCacheWithExpiry("cloudProfile_user", res?.data);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.log("ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Create an Account
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Get started with CloudProfile today
            </p>
          </div>
          <form className="space-y-6">
            <FormInput
              id="fullname"
              type="text"
              placeholder="Mohsin Raja"
              label="Full Name"
              value={signupData.name}
              onChange={(e) =>
                setSignupData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <FormInput
              id="email"
              type="email"
              placeholder="you@example.com"
              label="Email Address"
              value={signupData.email}
              onChange={(e) =>
                setSignupData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <FormInput
              id="password"
              type="password"
              placeholder="••••••••"
              label="Password"
              value={signupData.password}
              onChange={(e) =>
                setSignupData((prev) => ({ ...prev, password: e.target.value }))
              }
            />
            <FormInput
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              label="Confirm Password"
              value={signupData.confirmPassword}
              onChange={(e) =>
                setSignupData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
            />
            <FormButton
              disabled={loading}
              loading={loading}
              onClick={handleUserSignUp}
              label="Create Account"
            />
          </form>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="font-medium text-blue-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
