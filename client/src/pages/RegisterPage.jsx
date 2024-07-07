import React, { useState, useCallback } from "react";
import { MdClose, MdHeight } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import UploadFile from "../helpers/UploadFile";
import axios from "axios";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });

  const [uploadPhoto, setUploadPhoto] = useState(null);
  const navigate = useNavigate();

  const handleOnChange = useCallback((e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleUploadPhoto = useCallback(async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const uploadResult = await UploadFile(file);
        console.log("uploadResult", uploadResult);

        if (uploadResult?.secure_url) {
          setUploadPhoto(file);
          setData((prev) => {
            const newData = {
              ...prev,
              profile_pic: uploadResult.secure_url,
            };
            console.log("Updated Data:", newData);
            return newData;
          });
        } else {
          console.error("Upload failed: no URL returned");
        }
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  }, []);

  const handleClose = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
    setData((prev) => ({
      ...prev,
      profile_pic: "",
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api/register`;

      console.log("Backend URL:", URL);
      console.log("Data being sent:", data);

      try {
        const response = await axios.post(URL, data);
        console.log("response", response);
        toast.success(response.data.message);
        if (response.data.success) {
          setData({
            name: "",
            email: "",
            password: "",
            profile_pic: "",
          });
          navigate("/email");
        }
      } catch (error) {
        console.error("Error response:", error);
        toast.error(error?.response?.data?.message || "An error occurred");
      }
    },
    [data]
  );

  return (
    <div className="min-h-screen  py-6 flex flex-col justify-center sm:py-12 overflow-hidden ">
      <div className=" magic2 relative py-3 sm:max-w-xl sm:mx-auto w-full px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5170ff] to-[#ff66c4] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl overflow-hidden"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 overflow-hidden">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-xl font-bold mb-6">
                Register to{" "}
                <span>
                  {"<"}
                  {`PrinceDevChat`}❤{`/>`}💬
                </span>
              </h1>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={data.name}
                    onChange={handleOnChange}
                    required
                    className="bg-slate-100 px-2 py-1 w-full focus:outline-primary rounded"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700">
                    Email Address:
                  </label>
                  <input
                    autoComplete="off"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={data.email}
                    onChange={handleOnChange}
                    required
                    className="bg-slate-100 px-2 py-1 w-full focus:outline-primary rounded"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700">
                    Password:
                  </label>
                  <input
                    autoComplete="off"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={data.password}
                    onChange={handleOnChange}
                    required
                    className="bg-slate-100 px-2 py-1 w-full focus:outline-primary rounded"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="profile_pic" className="block text-gray-700">
                    Profile Picture:
                    <div className="h-14 bg-slate-200 cursor-pointer flex justify-center items-center border rounded hover:border-primary">
                      <p className="text-sm font-bold max-w-[300px] text-ellipsis line-clamp-1">
                        {uploadPhoto?.name
                          ? uploadPhoto?.name
                          : "Upload profile photo"}
                      </p>
                      {uploadPhoto?.name && (
                        <button
                          className="text-lg ml-2 hover:text-red-600"
                          onClick={handleClose}
                        >
                          <MdClose />
                        </button>
                      )}
                    </div>
                  </label>
                  <input
                    id="profile_pic"
                    name="profile_pic"
                    type="file"
                    className="bg-slate-100 px-2 py-1 w-full focus:outline-primary hidden rounded"
                    onChange={handleUploadPhoto}
                  />
                </div>
                <div className="relative">
                  <button className="bg-gradient-to-r from-[#5170ff] to-[#ff66c4] hover:bg-gradient-to-l text-white rounded-md px-2 py-1 mt-4 w-full">
                    Register
                  </button>
                </div>
              </form>
              <p className="my-3 text-center">
                Already have an account?{" "}
                <Link
                  className="hover:text-primary font-semibold"
                  to={"/email"}
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
