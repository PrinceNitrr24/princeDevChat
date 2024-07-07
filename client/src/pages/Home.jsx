import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from "../redux/UserSlice";
import Sidebar from "../components/Sidebar";
import logo from "../assets/p.PNG";
import io from "socket.io-client";
import "./Home.css";

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("user", user);

  const fetchUserDetails = async () => {
    try {
      const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });
      dispatch(setUser(response.data.data));
      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
      console.log("Current User Details", response);
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // ********** socket connection ***************
  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketConnection.on("onlineUser", (data) => {
      console.log(data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  console.log("location", location);
  const basePath = location.pathname === "/";

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      {/* message component */}
      <section className={`${basePath && "hidden"} `}>
        <Outlet />
      </section>

      <div
        className={`justify-center items-center flex-col gap-2 hidden ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        {/* <div className="magic  " >
          <img src={logo} alt="logo" width={600} className="rounded-lg  " />
        </div> */}
        <div className="magic">
          <video width={350} className="rounded-lg" autoPlay muted loop>
            <source
              src="Prince.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>

        <p className="text-lg mt-2 text-slate-500">
          Choose a Contact to Start Chatting!
        </p>
      </div>
    </div>
  );
};

export default Home;
