import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login, resetError } from "../../store/slices/authSlice";
import { Input, Button, PasswordInput } from "../index";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const submit = async (data) => {
    const loginAction = await dispatch(login(data));

    if (login.rejected.match(loginAction)) {
      return;
    }

    dispatch(resetError());
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full p-8 bg-black/50 backdrop-blur-xl rounded-xl border border-gray-800 shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Login
          </h2>
          <p className="mt-2 text-gray-400">
            Sign in to access your personalized experience
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input
            label="Username or Email Address"
            placeholder="Enter your username or email"
            type="text"
            className="text-gray-100"
            {...register("username", {
              required: "Username or email is required",
            })}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}

          <PasswordInput
            registration={register("password", {
              required: "Password is required",
            })}
            error={errors.password}
          />

          <Button
            className="w-full"
            type="submit"
            disabled={loading}
            variant="outline"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-center mt-4">
              <p className="text-red-500 text-sm font-medium">
                {error.message}
              </p>
            </div>
          )}
        </form>

        <div className="text-center text-gray-400 mt-6">
          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-violet-400 hover:text-violet-300 transition-colors duration-200"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
