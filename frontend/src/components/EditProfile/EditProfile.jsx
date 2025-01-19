import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {
  updateAccount,
  updateAvatar,
  updateCover,
} from "../../store/slices/userSlice.js";
import useCloudinaryUpload from "../../hooks/useCloudinaryUpload.js";
import { toast } from "react-toastify";
import {
  Input,
  Button,
  Loader,
  ToastContainer,
  CoverImageBanner,
  AvatarBanner,
} from "../index.js";

function EditProfile() {
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { startUpload } = useCloudinaryUpload();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user.username || "",
      email: user.email || "",
      fullName: user.fullname || "",
      avatar: null,
      coverImage: null,
    },
  });

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [coverPreview, setCoverPreview] = useState(user?.coverImage || null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setValue("avatar", file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      setValue("coverImage", file);
    }
  };

  const submit = async (formData) => {
    if (
      !formData.avatar &&
      !formData.coverImage &&
      formData.username === user.username &&
      formData.email === user.email &&
      formData.fullName === user.fullname
    ) {
      toast.info("No changes detected.");
      navigate(`/channel/${user.username}`);
      return;
    }

    setLoading(true);

    try {
      if (formData?.avatar) {
        const uploadedResponse = await startUpload({
          file: formData.avatar,
          folder: "avatars",
          resourceType: "image",
          metadata: {
            userId: user._id,
            type: formData.avatar.type,
            size: formData.avatar.size,
          },
        });

        await dispatch(updateAvatar({ avatar: uploadedResponse.secure_url }));
      }

      if (formData?.coverImage) {
        const uploadedResponse = await startUpload({
          file: formData.coverImage,
          folder: "coverImages",
          resourceType: "image",
          metadata: {
            userId: user._id,
            type: formData.coverImage.type,
            size: formData.coverImage.size,
          },
        });

        await dispatch(
          updateCover({ coverImage: uploadedResponse.secure_url })
        );
      }

      if (
        formData.fullName !== user.fullname ||
        formData.username !== user.username ||
        formData.email !== user.email
      ) {
        let data = {};
        if (formData.fullName !== user.fullname) {
          data.fullname = formData.fullName;
        }
        if (formData.username !== user.username) {
          data.username = formData.username;
        }
        if (formData.email !== user.email) {
          data.email = formData.email;
        }
        const resultAction = await dispatch(updateAccount(data));
        if (updateAccount.fulfilled.match(resultAction)) {
          toast.success("Profile updated successfully.");
          return navigate(`/channel/${user.username}`);
        } else {
          throw new Error(resultAction.payload.message);
        }
      }

      toast.success("Profile updated successfully.");
      return navigate(`/channel/${user.username}`);
    } catch (err) {
      return toast.error(
        err.message || "Something went wrong during editing profile!"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-[#111111] rounded-xl shadow-2xl p-4 sm:p-8">
        {/* Cover Image Section */}
        <div className="relative group">
          <CoverImageBanner coverPreview={coverPreview} />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <label
              htmlFor="cover-upload"
              className="bg-[#4169e1] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#3154b3] transition-colors"
            >
              Edit Cover
            </label>
          </div>
          <input
            type="file"
            id="cover-upload"
            accept="image/*"
            className="hidden"
            onChange={handleCoverChange}
          />
        </div>

        <ToastContainer />

        {/* Profile Info Section */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="relative group">
            <AvatarBanner avatarPreview={avatarPreview} />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <label
                htmlFor="avatar-upload"
                className="bg-[#4169e1] text-white px-3 py-1 rounded-lg cursor-pointer hover:bg-[#3154b3] transition-colors text-xs sm:text-sm"
              >
                Edit Avatar
              </label>
            </div>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-lg sm:text-2xl font-semibold text-white">
              {user?.fullname || "Your Name"}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              @{user?.username}
            </p>
          </div>
          <div className="w-full sm:w-auto sm:ml-auto">
            <Link
              to={`/profile`}
              className="block text-center bg-[#4169e1] text-white px-5 py-2 rounded-lg hover:bg-[#3154b3] transition-colors"
            >
              View Channel
            </Link>
          </div>
        </div>

        <hr className="my-4 sm:my-8 border-[#2a2a2a]" />

        {/* Personal Info Form */}
        <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4 sm:mb-6 text-[#4169e1]">
            Personal Info
          </h2>
          <form
            onSubmit={handleSubmit(submit)}
            className="space-y-4 sm:space-y-6"
          >
            <div className="space-y-2">
              <Input
                label="Full Name"
                id="fullName"
                {...register("fullName", {
                  validate: (value) => value.trim() !== "",
                })}
                className="w-full bg-[#111111] text-white border border-[#2a2a2a] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[#4169e1] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Username"
                id="username"
                {...register("username", {
                  validate: (value) => value.trim() !== "",
                  minLength: {
                    value: 3,
                    message: "New username must be at least 3 characters.",
                  },
                })}
                className="w-full bg-[#111111] text-white border border-[#2a2a2a] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[#4169e1] transition-colors"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                label="Email Address"
                id="email"
                type="email"
                {...register("email", {
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Invalid email format.",
                  },
                })}
                className="w-full bg-[#111111] text-white border border-[#2a2a2a] rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[#4169e1] transition-colors"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-wrap justify-end gap-2 sm:gap-4 mt-4 sm:mt-8">
              <Link to={`/channel/${user?.username}`}>
                <Button
                  type="button"
                  className="bg-[#2a2a2a] text-white hover:bg-[#333333] px-4 py-2 rounded-lg transition-colors"
                  variant="outline"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-[#4169e1] text-white hover:bg-[#3154b3] px-5 py-2 rounded-lg transition-colors"
                variant="subtle"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Change Password Link */}
        <div className="mt-4 sm:mt-8 text-center">
          <Link
            to="/change-password"
            className="text-[#4169e1] hover:text-[#3154b3] text-lg font-extrabold transition-colors"
          >
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
