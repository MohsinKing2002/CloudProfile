import { useState, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormButton, FormInput } from "../components";
import type { LoginProps } from "../types";
import { setCacheWithExpiry } from "../utilities";
import { processApiRequest } from "../apis";

export const LoginPage: FC = () => {
  /********** Variables *************/
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const [loginData, setLoginData] = useState<LoginProps>({
    loginIdentifier: "",
    password: "",
  });

  /********** Variables *************/

  const handleUserLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await processApiRequest("POST", "/auth/login", loginData);
      console.log("login", res);
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
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Welcome Back
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Sign in to continue to CloudProfile
            </p>
          </div>
          <form className="space-y-6">
            <FormInput
              id="email"
              type="email"
              placeholder="you@example.com or john01"
              label="Email or Username"
              value={loginData.loginIdentifier}
              onChange={(e) =>
                setLoginData((prev) => ({
                  ...prev,
                  loginIdentifier: e.target.value,
                }))
              }
            />
            <FormInput
              id="password"
              type="password"
              placeholder="••••••••"
              label="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, password: e.target.value }))
              }
            />

            <FormButton
              disabled={loading}
              loading={loading}
              onClick={handleUserLogin}
              label="Login"
            />
          </form>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="font-medium text-blue-500 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
