import { useEffect, useState, type FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  LoaderCircle,
  MessageCircleQuestionMark,
  Search,
  SendHorizontal,
  Sparkles,
} from "lucide-react";
import { LoaderScreen, UserAvatar } from "../components";
import { buttonGeneric } from "../global.style";
import type { UserProps } from "../types";
import { processApiRequest } from "../apis";
import toast from "react-hot-toast";

const Card = ({ children, className = "" }: any) => (
  <div
    className={`h-full bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 ${className}`}
  >
    {children}
  </div>
);

const SampleQuestionCard = ({ ques, setAskAIQuery }: any) => (
  <div
    onClick={() => setAskAIQuery(ques)}
    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-900 cursor-pointer"
  >
    <p className="text-sm text-gray-600 dark:text-blue-300">{ques}</p>
  </div>
);

const sampleQuestions = [
  "Can you explain the project’s main features?",
  "Are there any planned AI features in the project?",
  "Can you describe the project architecture?",
];

export const Home: FC = () => {
  /********** Variables *************/
  const [loading, setLoading] = useState<boolean>(false);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserProps[]>([]);
  const [filteredUserData, setFilteredUserData] = useState<UserProps[]>([]);
  const [searchUserQuery, setSearchUserQuery] = useState<string>("");
  const [askAIQuery, setAskAIQuery] = useState<string>("");
  const [rawAIAns, setRawAIAns] = useState<string>("");
  const [aiAns, setAIAns] = useState<string>("");

  /********** Functions *************/

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await processApiRequest("GET", "/auth/all-users");
      if (res?.status) {
        setUserData(res.data);
        setFilteredUserData(res.data);
      }
    } catch (error) {
      console.log("ERROR: Home page", error);
    } finally {
      setLoading(false);
    }
  };

  const chatWithAI = async () => {
    if (!askAIQuery) return toast.error("Query must not be empty!");
    setChatLoading(true);
    try {
      const res = await processApiRequest("POST", "/auth/chat", {
        query: askAIQuery,
      });
      if (res?.status) {
        setRawAIAns(res?.data?.answer);
      }
    } catch (error) {
      console.log("ERROR: AI Assistance", error);
    } finally {
      setChatLoading(false);
    }
  };

  /********** Useeffects *************/
  //response typewriter effect
  useEffect(() => {
    if (!rawAIAns) return;
    setAIAns(rawAIAns.charAt(0));
    let i = 0;

    const interval = setInterval(() => {
      setAIAns((prev) => prev + rawAIAns.charAt(i));
      i++;
      if (i >= rawAIAns.length) clearInterval(interval);
    }, 15);

    return () => clearInterval(interval);
  }, [rawAIAns]);

  useEffect(() => {
    if (searchUserQuery.length) {
      const query = searchUserQuery.toLowerCase();

      const filteredUsers = filteredUserData.filter(
        (user: UserProps) =>
          user.name.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query)
      );

      setFilteredUserData(filteredUsers);
    } else setFilteredUserData(userData);
  }, [searchUserQuery]);

  useEffect(() => {
    fetchUserData();
  }, []);

  return loading ? (
    <LoaderScreen />
  ) : (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      {/* Layout: Sidebar (1/4) and Main Content (3/4) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar (Search users) */}
        <Card className="md:col-span-1 order-2 md:order-1 sm:!p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
            <Search className="w-5 h-5 mr-2 text-blue-500" />
            Quick Search
          </h3>
          <input
            type="text"
            placeholder="Search name or username"
            value={searchUserQuery}
            onChange={(e: any) => setSearchUserQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="mt-6 space-y-3 border-t pt-4 border-gray-100 dark:border-gray-700">
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              Users
            </p>
            {filteredUserData.length > 0
              ? filteredUserData?.map((user: UserProps) => (
                  <UserAvatar key={user._id} name={user.name} />
                ))
              : "‼️ No Users found ‼️"}
          </div>
        </Card>

        {/* Main Content Area */}
        <div className="md:col-span-3 order-1 md:order-2">
          <Card>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-5 leading-tight">
              Welcome to CloudProfile
            </h1>
            <p className=" text-gray-600 dark:text-gray-400 leading-relaxed text-base">
              A full-stack CRUD web application built using React (Vite) for the
              frontend and Node.js + Express + MongoDB for the backend. The
              project showcases complete MERN development skills, along with
              CI/CD integration for automated deployment. <br />
              It’s hosted on AWS with Nginx as a reverse proxy server,
              demonstrating end-to-end web app deployment and DevOps practices.
              <br />
              <div className="mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 ps-3">
                ~ Md Mohsin Raja
              </div>
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-900">
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {userData.length ?? "5K+"}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-900">
                <p className="text-xs font-medium text-green-600 dark:text-green-400">
                  Success Rate
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  98%
                </p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-900">
                <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                  Feedback Score
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  4.5
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* AI Assistant section */}
      <Card className="my-6 md:col-span-1 order-2 md:order-1 !p-5 sm:!p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
          AI Project Assistant
        </h3>
        <div className="flex items-center flex-row">
          <input
            type="text"
            placeholder="Ask about the Project"
            value={askAIQuery}
            onChange={(e: any) => setAskAIQuery(e.target.value)}
            className="flex-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            className={`ml-2 sm:ml-4 ${buttonGeneric} cursor-pointer !px-3 sm:!px-5`}
            onClick={chatWithAI}
            disabled={chatLoading}
          >
            {chatLoading ? (
              <LoaderCircle className="ml-2 animate-spin text-base" />
            ) : (
              <SendHorizontal />
            )}
          </button>
        </div>
        <div className="flex flex-col-reverse sm:flex-row flex-wrap gap-x-8 gap-y-4">
          <div className="mt-6 space-y-3 border-t pt-4 border-gray-100 dark:border-gray-700">
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              Sample Questions
            </p>
            <div className="flex items-center flex-row flex-wrap gap-x-8 gap-y-4">
              {sampleQuestions?.map((ques: string, index: number) => (
                <SampleQuestionCard
                  key={index}
                  ques={ques}
                  setAskAIQuery={setAskAIQuery}
                />
              ))}
            </div>
          </div>
          {aiAns && (
            <div className="mt-5 border-t pt-4 px-2 border-gray-100 dark:border-gray-700">
              <div className="flex items-start pb-4">
                <MessageCircleQuestionMark className="mr-2" />
                <p className="text-base sm:text-xl font-semibold text-gray-700 dark:text-gray-300">
                  {askAIQuery}
                </p>
              </div>
              <div className="sm:pl-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {aiAns.replace(/\\n/g, "\n").replace(/(\d\.)/g, "\n$1")}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
