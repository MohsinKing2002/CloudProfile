import { useContext, useState, type FC } from "react";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import { FormButton, FormInput } from "../components";
import { type FeedbackProps } from "../types";
import { AuthContext } from "../contexts/AuthContext";
import { setCacheWithExpiry } from "../utilities";
import { processApiRequest } from "../apis";
import { useNavigate } from "react-router-dom";

const ratingData = [
  { rating: 1, text: "Very Bad" },
  { rating: 2, text: "Okay" },
  { rating: 3, text: "Good" },
  { rating: 4, text: "Very Good" },
  { rating: 5, text: "Loved it!" },
];

export const Feedback: FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState<number>(user?.feedback?.rating ?? 0);
  const [hover, setHover] = useState<number>(user?.feedback?.rating ?? 0);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackProps>({
    name: user?.name,
    email: user?.email,
    feedback_text: user?.feedback?.text,
    rating: user?.feedback?.rating,
  });

  const currentText =
    ratingData.find((r) => r.rating === (hover || rating))?.text || "";

  const handleRating = (num: number = 0, event: string) => {
    if (event === "CLICK") {
      setRating(num);
      setFeedbackData((prev) => ({ ...prev, rating: num }));
    }
    if (event === "MOUSE_ENTER") setHover(num);
    if (event === "MOUSE_LEAVE") setHover(0);
  };

  const handleFeedbackSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (!feedbackData.feedback_text || !feedbackData.rating)
        return toast.error("All fields are required!");

      setLoading(true);
      const res = await processApiRequest(
        "POST",
        "/auth/user-feedback",
        feedbackData
      );
      if (res?.status) {
        setCacheWithExpiry("cloudProfile_user", res?.data);

        //navigate to user profile after 1.5 seconds
        setTimeout(() => {
          navigate("/profile");
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.log("ERROR: Giving Feedback", error);
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
              Your Feedback
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Share your thoughts to help us improve.
            </p>
          </div>
          <form className="space-y-6">
            <FormInput
              id="name"
              type="text"
              placeholder="Enter you name"
              label="Name"
              value={feedbackData.name}
              onChange={(e) =>
                setFeedbackData((prev) => ({ ...prev, name: e.target.value }))
              }
            />

            <FormInput
              id="email"
              type="email"
              placeholder="Enter your email"
              label="Email"
              value={feedbackData.email}
              onChange={(e) =>
                setFeedbackData((prev) => ({ ...prev, email: e.target.value }))
              }
            />

            <FormInput
              isTextarea
              id="feedback"
              type="text"
              placeholder="Write your feedback here..."
              label="Feedback"
              value={feedbackData.feedback_text}
              onChange={(e) =>
                setFeedbackData((prev) => ({
                  ...prev,
                  feedback_text: e.target.value,
                }))
              }
            />
            <div>
              <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How was your experience?
              </p>
              <div className="flex space-x-5 justify-center py-2">
                {ratingData?.map(({ rating: index }) => (
                  <Star
                    key={index}
                    onClick={() => handleRating(index, "CLICK")}
                    onMouseEnter={() => handleRating(index, "MOUSE_ENTER")}
                    onMouseLeave={() => handleRating(index, "MOUSE_LEAVE")}
                    fill={index <= (hover || rating) ? "currentColor" : "none"}
                    className={`w-8 h-8 cursor-pointer ${
                      index <= (hover || rating)
                        ? "text-yellow-400"
                        : "text-gray-400 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>

              <p className="h-6 text-center text-sm text-gray-600 dark:text-gray-300">
                {currentText ?? ""}
              </p>
            </div>
            <FormButton
              disabled={loading}
              loading={loading}
              onClick={handleFeedbackSubmit}
              label="Submit Feedback"
            />
          </form>
        </div>
      </div>
    </div>
  );
};
