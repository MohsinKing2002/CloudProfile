import { useContext, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { FormButton, FormInput } from "../components";
import { AuthContext } from "../contexts/AuthContext";
import type { EditProfileProps } from "../types";
import { setCacheWithExpiry } from "../utilities";
import { processApiRequest } from "../apis";

export const EditProfile: FC = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(
    user?.avatar
  );
  const [editData, setEditData] = useState<EditProfileProps>({
    name: user?.name,
    bio: user?.bio,
  });

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setAvatar(Reader.result);
      }
    };
  };

  const handleEditProfileSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { name, bio } = editData;
      const formData = new FormData();
      formData.append("avatar", String(avatar));
      formData.append("name", name);
      formData.append("bio", bio);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const res = await processApiRequest(
        "PUT",
        "/auth/update-profile",
        formData,
        config
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
      console.log("ERROR: Edit Profile", error);
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
              Update your Profile
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Get started with CloudProfile today
            </p>
          </div>
          <form className="space-y-6">
            {avatar ? (
              <img
                className="w-32 h-32 rounded-full m-auto my-2 object-cover"
                src={String(avatar)}
                alt="post_prev"
              />
            ) : null}
            <div>
              <label
                htmlFor={"avatar"}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Profile Photo
              </label>

              <input
                type="file"
                id="avatar"
                name="avatar"
                placeholder="Choose your avatar"
                className="w-full px-4 py-2 rounded-md bg-gray-200 dark:bg-[#374151] border border-gray-300 dark:border-[#4B5563] text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                onChange={handleImageUpload}
              />
            </div>

            <FormInput
              id="name"
              type="text"
              placeholder="Mohsin Raja"
              label="Name"
              value={editData.name}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, name: e.target.value }))
              }
            />

            <FormInput
              isTextarea
              id="bio"
              type="text"
              placeholder="Tell us about yourself (interest, hobies, etc.)"
              label="Bio"
              value={editData.bio}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, bio: e.target.value }))
              }
            />
            <FormButton
              disabled={loading}
              loading={loading}
              onClick={handleEditProfileSubmit}
              label="Update Profile"
            />
          </form>
        </div>
      </div>
    </div>
  );
};
