import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import swirl from "../assets/login-image.jpg";
import toast from "react-hot-toast";

export default function AuthForm() {
  const navigate = useNavigate();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const api_endpoint = import.meta.env.VITE_API_URL;

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const isToken = localStorage.getItem("token");
    if (isToken) {
      navigate("/courses");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    setErrors((prev) => {
      if (id === "email") {
        if (value.trim() === "") {
          return { ...prev, email: "Email is required" };
        } else if (!isValidEmail(value.trim())) {
          return { ...prev, email: "Enter a valid email address" };
        } else {
          return { ...prev, email: "" };
        }
      }

      if (id === "password") {
        return {
          ...prev,
          password: value.trim() === "" ? "Password is required" : "",
        };
      }

      return prev;
    });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Enter a valid email address" }));
      return;
    }

    setIsLoading(true);
    const endpoint = isLoginMode ? "/login" : "/register";

    try {
      const res = await fetch(`${api_endpoint}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, googleLogin: false }),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLoginMode) {
          localStorage.setItem("token", data?.access_token);
          toast.success("Login Successful");
          setTimeout(() => navigate("/courses"), 1000);
        } else {
          toast.success("Registration Successful. Please log in.");
          setIsLoginMode(true);
          setFormData({ email: "", password: "" });
        }
      } else {
        toast.error(data?.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Request Failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const response = await fetch(`${api_endpoint}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: decoded?.email,
          googleLogin: true,
        }),
      });

      if (!response.ok) {
        toast.error("Login through Google failed. Please try again later");
        throw new Error("API request failed");
      }
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data?.access_token);
        toast.success("Login Successful");
        setTimeout(() => navigate("/courses"), 1000);
      }
    } catch (error) {
      console.error("Login or API error:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${swirl})` }}
    >
      <div className="flex flex-col lg:flex-row w-[90vw] h-[90vh] max-w-4xl rounded-xl overflow-hidden shadow-xl">
        {/* Left */}
        <div className="hidden lg:flex w-1/2 bg-transparent/10 backdrop-blur-md text-white p-10 flex-col justify-center rounded-l-xl libre-baskerville-regular">
          <div className="max-w-md mx-auto">
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Study Smarter,
              <br />
              Not Harder
            </h2>
            <p className="text-sm text-black font-light">
              "Success doesn’t come from what you do occasionally, it comes from
              what you do consistently. Focus, learn, revise — and believe in
              your potential."
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="w-full lg:w-1/2 p-8 bg-white h-full flex flex-col justify-center rounded-r-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center libre-baskerville-regular">
            {isLoginMode ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center libre-baskerville-regular">
            {isLoginMode
              ? "Enter your credentials to sign in"
              : "Fill in your details to register"}
          </p>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                className={`w-full ${
                  errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                placeholder="example@email.com"
              />

              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={`w-full ${
                    errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                !formData.email ||
                !formData.password ||
                !!errors.email ||
                !!errors.password ||
                isLoading
              }
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  {isLoginMode ? "Logging in..." : "Registering..."}
                </span>
              ) : isLoginMode ? (
                "Sign In"
              ) : (
                "Register"
              )}
            </button>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
            <GoogleLogin
              onSuccess={handleGoogleSignIn}
              onError={() => {
                console.log("Login Failed");
              }}
            />

            {/* Toggle Form Button */}
            <p className="text-sm text-center mt-2">
              {isLoginMode ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginMode(false);
                      setFormData({ email: "", password: "" });
                      setErrors({ email: "", password: "" });
                    }}
                    // onClick={() => setIsLoginMode(false)}
                    className="text-blue-600 underline cursor-pointer"
                  >
                    Register here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginMode(true);
                      setFormData({ email: "", password: "" });
                      setErrors({ email: "", password: "" });
                    }}
                    className="text-blue-600 underline cursor-pointer"
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
