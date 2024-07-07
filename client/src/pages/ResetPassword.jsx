import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { password };
    try {
      const response = await axios.post(
        `http://localhost:3000/api/reset-password/${token}`,
        data
      );
      console.log(response); // Log the response for debugging
      if (
        response.status === 200 &&
        response.data.message === "Updated Password Successfully!"
      ) {
        toast.success("Your password has been reset!");
        setTimeout(() => navigate("/login"), 2000); // Delay navigation
      } else {
        toast.error(response.data.message || "Failed to reset password.");
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12 overflow-hidden">
      <div className="magic2 relative py-3 sm:max-w-xl sm:mx-auto w-full px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5170ff] to-[#ff66c4] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl overflow-hidden"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 overflow-hidden">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-xl font-bold mb-6 text-center">
                {/* Register to{" "} */}
                <span>
                  {"<"}
                  {`PrinceDevChat`}❤{`/>`}💬
                </span>
              </h1>
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
                Reset Password
              </h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700">
                    New Password:
                  </label>
                  <input
                    autoComplete="off"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-slate-100 px-2 py-1 w-full focus:outline-primary rounded"
                  />
                </div>

                <div className="relative">
                  <button className="bg-gradient-to-r from-[#5170ff] to-[#ff66c4] hover:bg-gradient-to-l text-white rounded-md px-2 py-1 mt-4 w-full">
                    Reset
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

export default ResetPassword;
