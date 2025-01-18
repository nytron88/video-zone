import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  login,
  register as signup,
  resetError,
} from "../../store/slices/authSlice";
import { updateAvatar, updateCover } from "../../store/slices/userSlice";
import {
  Input,
  Button,
  ImageUploader,
  PasswordInput,
  ToastContainer,
} from "../index";
import { toast } from "react-toastify";
import useCloudinaryUpload from "../../hooks/useCloudinaryUpload";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { startUpload, uploadError } = useCloudinaryUpload();

  const submit = async (formData) => {
    const submitData = {
      fullname: formData.fullname,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    const signupAction = await dispatch(signup(submitData));

    if (signup.rejected.match(signupAction)) {
      const errorMessage =
        signupAction.payload?.message || "An unknown error occurred";
      toast.error(errorMessage);
      return;
    }

    const { email, password } = submitData;
    const loginAction = await dispatch(login({ email, password }));

    if (login.rejected.match(loginAction)) {
      const errorMessage =
        loginAction.payload?.message || "An unknown error occurred";
      toast.error(errorMessage);
      return;
    }

    if (formData.avatar?.[0]) {
      const uploadResponse = await startUpload({
        file: formData.avatar[0],
        folder: "avatars",
        resourceType: "image",
        metadata: {
          username: formData.username,
          email: formData.email,
          type: formData.avatar[0].type,
          size: formData.avatar[0].size,
        },
      });

      if (uploadError) {
        toast.error(uploadError.message);
        return;
      }

      dispatch(updateAvatar({ avatar: uploadResponse.secure_url }));
    }

    if (formData.coverImage?.[0]) {
      const uploadResponse = await startUpload({
        file: formData.coverImage[0],
        folder: "coverImages",
        resourceType: "image",
        metadata: {
          username: formData.username,
          email: formData.email,
          type: formData.coverImage[0].type,
          size: formData.coverImage[0].size,
        },
      });

      if (uploadError) {
        toast.error(uploadError.message);
        return;
      }

      dispatch(
        updateCover({
          coverImage: uploadResponse.secure_url,
        })
      );
    }

    dispatch(resetError());
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <ToastContainer />

      <div className="max-w-4xl w-full p-8 bg-black/50 backdrop-blur-xl rounded-xl border border-gray-800 shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-gray-400">
            Sign up to have a personalized experience
          </p>
        </div>

        {/* Form */}
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit(submit)}
        >
          {/* Column 1 */}
          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              type="text"
              className="text-gray-100"
              {...register("fullname", {
                required: "Full name is required.",
                minLength: {
                  value: 3,
                  message: "Full name must be at least 3 characters.",
                },
              })}
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm">{errors.fullname.message}</p>
            )}

            <Input
              label="Username"
              placeholder="johndoe"
              type="text"
              className="text-gray-100"
              {...register("username", {
                required: "Username is required.",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters.",
                },
              })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}

            <Input
              label="Email"
              placeholder="johndoe@example.com"
              type="email"
              className="text-gray-100"
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Invalid email format.",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <PasswordInput
              registration={register("password", {
                required: "Password is required.",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long.",
                },
              })}
              error={errors.password}
            />
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <PasswordInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              registration={register("confirmPassword", {
                required: "Confirm Password is required.",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match.",
              })}
              error={errors.confirmPassword}
            />
            <ImageUploader
              label="Profile Picture (Optional)"
              id="avatar"
              register={register}
            />
            <ImageUploader
              label="Cover Image (Optional)"
              id="coverImage"
              register={register}
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2">
            <Button className="w-full" type="submit" variant="outline">
              Create Account
            </Button>
            {/* 
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-center mt-4">
                <p className="text-red-500 text-sm font-medium">
                  {error.message}
                </p>
              </div>
            )} */}
          </div>
        </form>

        <div className="text-center text-gray-400 mt-6">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-violet-400 hover:text-violet-300 transition-colors duration-200"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
