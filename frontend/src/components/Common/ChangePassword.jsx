import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader, Button, PasswordInput } from "../index.js";
import { changePassword } from "../../store/slices/userSlice";

function ChangePassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      return;
    }
    const changePasswordAction = await dispatch(changePassword(data));

    if (changePassword.rejected.match(changePasswordAction)) {
      return;
    }
    navigate("/edit-profile");
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-blue-500 mb-3">
            Change Password
          </h2>
          <p className="text-gray-400 text-base">
            Update your account password
          </p>
        </div>

        {error && (
          <div
            className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="space-y-4">
            <div>
              <PasswordInput
                label="Current Password"
                registration={register("currentPassword", {
                  required: "Current password is required",
                })}
                error={errors.currentPassword}
              />
            </div>
            <div>
              <PasswordInput
                label="New Password"
                registration={register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  validate: (value) =>
                    watch("currentPassword") !== value ||
                    "New password cannot be the same as current password",
                })}
                error={errors.newPassword}
              />
            </div>

            <div>
              <PasswordInput
                label="Confirm Password"
                registration={register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                })}
                error={errors.confirmPassword}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              variant="subtle"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </Button>

            <Link
              to="/edit-profile"
              className="text-center text-lg text-blue-500 hover:text-blue-400 transition-colors duration-200"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
