import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
// import swirl from "../assets/login-image.jpg";
import swirl from "../assets/login-image.jpg";

export default function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    setErrors((prev) => ({
      ...prev,
      [id]: value.trim() === "" ? "This field is required" : "",
    }));
  };

  const handleLogin = async () => {
    setIsLoading(true);

    const hardcodedUsername = "Shaheed Zulfiqar Ali Bhutto";
    const hardcodedPassword = "szabist123";
    const hardcodedEmail = "admin@example.com";

    try {
      if (
        formData.username === hardcodedUsername &&
        formData.password === hardcodedPassword
      ) {
        // Store credentials
        localStorage.setItem("token", "dummy_token");
        localStorage.setItem("user_name", hardcodedUsername);
        localStorage.setItem("user_role", "admin");
        localStorage.setItem("email", hardcodedEmail);

        toast.success("Login Successful");
        navigate("/app");
      } else {
        toast.error("Incorrect username or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login Failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
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
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center libre-baskerville-regular">
            Enter your username and password to sign in
          </p>

          <div className="space-y-4">
            {/* Username */}
            <div className="w-full">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border text-sm px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors.username
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-gray-200"
                }`}
                placeholder="admin"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={`mt-1 w-full px-3 py-2 pr-10 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-gray-200"
                  }`}
                  placeholder="••••••••"
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
              onClick={handleLogin}
              disabled={
                !formData.username ||
                !formData.password ||
                !!errors.username ||
                isLoading
              }
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Logging in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
