import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import Divider from "./Divider";
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from "./SearchUser";
import { FaImage, FaVideo } from "react-icons/fa6";
import { logout } from "../redux/UserSlice";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (socketConnection) {
      console.log("Socket connected, emitting sidebar event");
      socketConnection.emit("sidebar", user._id);

      socketConnection.on("conversation", (data) => {
        console.log("Received conversation data:", data);

        const conversationUserData = data.map((conversationUser, index) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });

        console.log("Formatted conversation user data:", conversationUserData);
        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/email");
    localStorage.clear();
  };

  return (
    <>
      <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
        <div className="flex flex-row items-center justify-center h-12 w-full">
          <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
            <NavLink
              className={({ isActive }) =>
                `w-12 h-12 flex justify-center items-center rounded-full cursor-pointer hover:bg-slate-200${
                  isActive && "bg-slate-200"
                }`
              }
              title="chat"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                ></path>
              </svg>
            </NavLink>
          </div>
          <div className=" ml-1 font-bold">
            <Link href="/">
              <h1 className="cursor-pointer hover:text-gray-700">
                <span>
                  {"<"}
                  {`PrinceDevChat`}❤{`/>`}
                </span>
              </h1>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center hero bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
          <div
            className="h-20  w-20 rounded-full bg-green-300 border cursor-pointer flex justify-center shadow-xl items-center animated-border"
            title={user?.name}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              width={70}
              height={70}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </div>
          <div className="text-sm font-semibold mt-2">{user?.name}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>

          <div className="flex flex-row items-center mt-3">
            <div className="h-3 w-3 bg-green-500 rounded-full self-end mr-1"></div>
            <div className="leading-none text-xs font-semibold">Online</div>
          </div>
        </div>

        <div className="flex w-full bg-blue-200 rounded gap-1  mt-2 hover:bg-blue-300">
          <p className=" flex justify-center items-center font-semibold ml-10">
            Add Friend
          </p>
          <div
            title="add friend"
            onClick={() => setOpenSearchUser(true)}
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 hover:rounded-full rounded"
          >
            <FaUserPlus size={20} />
          </div>
        </div>

        <div className="flex flex-col mt-8">
          <div className="flex flex-row items-center justify-between text-xs">
            <span className="font-bold">Active Conversations</span>
            <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
              {allUser.length}
            </span>
          </div>

          <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
            {allUser.map((conv, index) => (
              <NavLink
                to={"/" + conv?.userDetails?._id}
                key={conv?._id}
                className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer"
              >
                <div>
                  <Avatar
                    imageUrl={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.name}
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaImage />
                          </span>
                          {!conv?.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {conv?.lastMsg?.videoUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaVideo />
                          </span>
                          {!conv?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>
                    <p className="text-ellipsis line-clamp-1">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {Boolean(conv?.unseenMsg) && (
                  <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full">
                    {conv?.unseenMsg}
                  </p>
                )}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="w-full gap-1 bg-red-400 hover:bg-red-500 cursor-pointer font-semibold rounded flex   justify-center items-center  mt-6">
          <p className="flex justify-center items-center  ">Logout</p>
          <button
            title="logout"
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-red-200 rounded-full"
            onClick={handleLogout}
          >
            <span className="-ml-2">
              <BiLogOut size={20} />
            </span>
          </button>
        </div>

        {/**edit user details*/}
        {editUserOpen && (
          <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
        )}

        {openSearchUser && (
          <SearchUser onClose={() => setOpenSearchUser(false)} />
        )}
      </div>
    </>
  );
};

export default Sidebar;
