import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/UserSlice";

const VerifyPassword = () => {
  const [data, setData] = useState({
    password: "",
    userId: null,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Log location state once on mount
  useEffect(() => {
    console.log("location", location.state);
  }, []);

  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
      toast.error("Oops, something went wrong!😔");
    }
  }, [location, navigate]);

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
      const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api/password`;

      try {
        const response = await axios({
          method: "post",
          url: URL,
          data: {
            userId: location?.state?._id,
            password: data.password,
          },
          withCredentials: true,
        });

        toast.success(response.data.message);

        if (response.data.success) {
          dispatch(setToken(response?.data?.token));
          localStorage.setItem("token", response?.data?.token);
          setData({
            password: "",
          });
          navigate("/");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "An error occurred");
      }
    },
    [data, navigate]
  );

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12 overflow-hidden">
      <div className="magic2 relative py-3 sm:max-w-xl sm:mx-auto w-full px-4">
        <div className="absolute inset-0 bg-gradient-to-r  from-[#5170ff] to-[#ff66c4] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl overflow-hidden"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 overflow-hidden">
          <div className="max-w-md mx-auto">
            <div className="w-fit mx-auto mb-1 flex justify-center items-center flex-col">
              <Avatar
                width={100}
                height={100}
                name={location?.state?.name}
                imageUrl={location?.state?.profile_pic}
              />
              <h2 className="font-semibold text-lg mt-1">
                {location?.state?.name}
              </h2>
            </div>

            <h1 className="text-xl font-bold mb-6">
              Welcome to{" "}
              <span>
                {"<"}
                {`PrinceDevChat`}❤{`/>`}💬
              </span>
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">
                  Password:
                </label>
                <input
                  autoComplete="off"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={data.password}
                  onChange={handleOnChange}
                  required
                  className="bg-slate-100 mt-2 px-2 py-1 w-full focus:outline-primary rounded"
                />
              </div>

              <div className="relative">
                <button className="bg-gradient-to-r from-[#5170ff] to-[#ff66c4] hover:bg-gradient-to-l text-white rounded-md px-2 py-1 mt-4 w-full">
                  Login
                </button>
              </div>
            </form>
            <p className="my-3 text-center">
              you've forgotten your password?{" "}
              <Link
                className="hover:text-primary font-semibold"
                to={"/forgot-password"}
              >
                Click here?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPassword;
