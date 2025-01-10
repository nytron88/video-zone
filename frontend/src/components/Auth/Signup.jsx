import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login, register as signup } from "../../store/slices/authSlice";
import { Input, Button, Loader, ImageUploader } from "../index";

function Signup() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const [error, setError] = useState("");

  const submit = async (data) => {
    setError("");
    const signupAction = await dispatch(signup(data));

    if (signupAction.error) {
      setError(signupAction.payload.message);
      return;
    }

    const { email, password } = data;
    const loginAction = await dispatch(login({ email, password }));

    if (loginAction.error) {
      setError(loginAction.payload.message);
      return;
    }

    navigate("/");
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

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
              {...register("fullname", { required: true })}
            />
            <Input
              label="Username"
              placeholder="johndoe"
              type="text"
              className="text-gray-100"
              {...register("username", {
                required: true,
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message:
                    "Username can only contain letters, numbers, and underscores",
                },
              })}
            />
            <Input
              label="Email"
              placeholder="johndoe@example.com"
              type="email"
              className="text-gray-100"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              className="text-gray-100"
              {...register("password", { required: true })}
            />
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              type="password"
              className="text-gray-100"
              {...register("confirmPassword", { required: true })}
            />
            <ImageUploader label="Cover Image (Optional)" id="coverImage" />
            <ImageUploader label="Profile Picture (Optional)" id="avatar" />
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2">
            <Button
              className="w-full"
              type="submit"
              disabled={loading}
              variant="outline"
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-center mt-4">
                <p className="text-red-500 text-sm font-medium">{error}</p>
              </div>
            )}
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
