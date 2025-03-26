import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAccountLogin } from "../../../Hooks/User/Authentication/LoginHooks";
import { LoginFormInputs } from "../../../Services/User/Authentication/LoginServices";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useAccountLogin();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    // Trigger login mutation and handle success or error via toast notifications
    loginMutation.mutate(data, {
      onError: (error: any) => {
        // Show toast for errors during login
        toast.error(error.message || "Login failed. Please try again.");
      },
      onSuccess: (response) => {
        if (!response || !response.userType) {
          toast.error("Unexpected response from server. Please try again.");
          return;
        }

        toast.success(`Logged in as: ${response.userType}`);

        // Navigation logic based on userType and isProfileCompleted
        if (response.userType === "Labour") {
          // If profile is not completed, go to profile settings
          if (!response.isProfileCompleted) {
            navigate("/profile-settings");
            return;
          }
          // If profile is completed, go to labour home page
          navigate("/labour-home-page");
          return;
        }

        if (response.userType === "Employer") {
          navigate("/client-home-page");
          return;
        }

        // Fallback navigation
        navigate("/");
      },
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="w-full h-full flex flex-row">
        {/* Image section - hidden on small screens, shown on md and up */}
        <div className="hidden md:flex w-1/2 bg-gray-300">
          <img
            src="/assets/RegistrationImage.JPEG"
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form section - takes full width on small screens, half on md and up */}
        <div className="w-full md:w-1/2 flex flex-row justify-center items-center p-4 bg-white">
          <div className="w-full max-w-md px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Login to Your Account</h2>
            <p className="text-gray-500 text-center mb-6">
              Welcome back! Please enter your details
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Please enter a valid email",
                    },
                  })}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
              >
                Login
              </button>
            </form>

            <p className="mt-4 text-center">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/registration")}
                className="text-purple-600 font-semibold hover:underline cursor-pointer"
              >
                Register here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;