import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleOnChange = useCallback((e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isSubmitting) return;

      setIsSubmitting(true);
      const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api/forgot-password`;

      try {
        const response = await axios.post(URL, data);

        if (response.data.success) {
          toast.success(response.data.message);
          navigate("/forgot-password", {
            state: response?.data?.data,
          });
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "An error occurred");
      } finally {
        setIsSubmitting(false);
      }
    },
    [data, navigate, isSubmitting]
  );

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12 overflow-hidden">
      <div className="magic2 relative py-3 sm:max-w-xl sm:mx-auto w-full px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5170ff] to-[#ff66c4] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl overflow-hidden"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 overflow-hidden">
          <div className="max-w-md mx-auto">
            <div>
              <div className="w-fit mx-auto mb-1">
                <img
                  className="rounded-full"
                  src="./go.gif"
                  alt="user"
                  width={100}
                  height={100}
                />
              </div>
              <h1 className="text-xl text-center font-bold mb-6">
                Forgot Password
              </h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700">
                    Email Address:
                  </label>
                  <input
                    autoComplete="off"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter Email address"
                    value={data.email}
                    onChange={handleOnChange}
                    required
                    className="bg-slate-100 px-2 mt-2 py-1 w-full focus:outline-primary rounded"
                  />
                </div>

                <div className="relative">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#5170ff] to-[#ff66c4] hover:bg-gradient-to-l text-white rounded-md px-2 py-1 mt-4 w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
              <Toaster />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
