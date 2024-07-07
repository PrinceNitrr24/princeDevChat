import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import toast from "react-hot-toast";
import axios from "axios";
import { CgClose } from "react-icons/cg";

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchUser = async () => {
    const URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api/search-user`;
    try {
      setLoading(true);
      const response = await axios.post(URL, {
        search: search,
      });
      setLoading(false);
      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [search]);

  console.log("searchUser", searchUser);

  return (
    <div className="fixed  top-0 left-0 bottom-0 right-0 bg-slate-700 bg-opacity-50 p-2 z-10">
      <div className="w-full  max-w-lg mx-auto mt-10">
        {/* input search user */}
        <div className="bg-white rounded-full h-14 flex  cursor-pointer shadow-lg overflow-hidden ">
          <input
            type="text"
            placeholder="Search User by name, email..."
            className="w-full outline-none py-1 h-full px-4 "
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="w-14 h-14 flex justify-center items-center pr-5">
            <FiSearch size={25} />
          </div>
        </div>
        {/* Display Search User */}
        {/* bg-gradient-to-l from-[#365afc] to-[#fb9dfb] */}
        <div className=" mt-2 w-full p-4 rounded bg-gradient-to-l from-[#3f61f7] to-[#feb3fe]">
          {/* no user found */}
          {searchUser.length === 0 && !loading && (
            <p className="text-center text-slate-500 ">No user found!😔</p>
          )}
          {loading && (
            <p>
              {" "}
              <Loading />{" "}
            </p>
          )}
          {searchUser.length !== 0 &&
            !loading &&
            searchUser.map((user, index) => {
              return (
                <UserSearchCard key={user._id} user={user} onClose={onClose} />
              );
            })}
        </div>
      </div>
      <div
        className="absolute top-0 right-0  text-2xl p-2 lg:text-4xl hover:text-white"
        onClick={onClose}
      >
        <button>
          <CgClose size={25} />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;
