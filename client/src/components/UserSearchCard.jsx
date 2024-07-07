import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const UserSearchCard = ({ user, onClose }) => {
  return (
    <Link
      to={"/" + user?._id}
      onClick={onClose}
      className="flex items-center gap-3 mt-3 p-2 border lg:p-3 border-transparent  shadow-lg rounded-full border-b-slate-200 hover:border hover:border-white  cursor-pointer"
    >
      <div
        className="rounded-full border"
        style={{ boxShadow: "2px 4px 6px wheat", border: "2px solid white " }}
      >
        <Avatar
          width={50}
          height={50}
          name={user?.name}
          userId={user?._id}
          imageUrl={user?.profile_pic}
        />
      </div>
      <div>
        <div className="font-semibold text-ellipsis line-clamp-1">
          {user?.name}
        </div>
        <p className="text-sm text-ellipsis line-clamp-1">{user.email}</p>
      </div>
    </Link>
  );
};

export default UserSearchCard;
