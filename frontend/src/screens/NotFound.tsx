import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center text-center px-4 ">
        <h1 className="text-8xl font-bold text-indigo-500">404</h1>
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mt-5">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 my-3 max-w-md">
          Oops! The page you are looking for does not exist. It might have been
          moved or deleted.
        </p>
        <Link
          to={"/"}
          className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 dark:focus:ring-offset-gray-900 focus:ring-indigo-500 transition duration-200"
        >
          Go Back Home
        </Link>
      </div>
    </>
  );
};
