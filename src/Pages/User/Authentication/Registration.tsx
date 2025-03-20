import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRegisterUser } from "../../../Hooks/User/Authentication/RegistrationHook";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

interface RegisterFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("Labour");
  const registerMutation = useRegisterUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    registerMutation.mutate(
      { email: data.email, password: data.password, userType },
      {
        onSuccess: () => navigate("/login"),
      }
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="w-full h-full flex flex-row">
        {/* Left Side - Image Section (hidden on mobile) */}
        <div className="hidden md:flex w-1/2 bg-gray-300">
          <img 
            src="/assets/RegistrationImage.JPEG" 
            alt="Registration" 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full md:w-1/2 flex flex-row justify-center items-center p-4 bg-white">
          <div className="w-full max-w-md px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Create an Account</h2>
            <p className="text-gray-500 text-center mb-6">Join us and get started today</p>

            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">User Type: {userType}</span>
              <button
                type="button"
                onClick={() => setUserType(userType === "Labour" ? "Employer" : "Labour")}
                className="bg-gray-300 w-14 h-7 rounded-full flex items-center p-1 transition-all"
              >
                <div className={`w-6 h-6 bg-blue-500 rounded-full transform ${userType === "Employer" ? "translate-x-7" : "translate-x-0"}`}></div>
              </button>
            </div>

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
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div className="relative">
                <input 
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/,
                      message: "Password must contain at least one uppercase letter, one number, and one special character",
                    }
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
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              <div>
                <input 
                  {...register("confirmPassword", { 
                    required: "Confirm your password", 
                  })}
                  type="password" 
                  placeholder="Confirm Password" 
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500" 
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
              </div>

              <button 
                type="submit" 
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
              >
                Register
              </button>
            </form>

            <p className="mt-4 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
