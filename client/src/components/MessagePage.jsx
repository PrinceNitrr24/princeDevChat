import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaPlus, FaImage, FaVideo } from "react-icons/fa6";
import uploadFile from "../helpers/UploadFile";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";
import { IoMdSend } from "react-icons/io";
import moment from "moment";

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages or new message state changes
  useEffect(() => {
    scrollToBottom();
  }, [allMessage, message]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    setMessage((prev) => ({ ...prev, imageUrl: uploadPhoto.url }));
  };

  const handleClearUploadImage = () => {
    setMessage((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    setMessage((prev) => ({ ...prev, videoUrl: uploadPhoto.url }));
  };

  const handleClearUploadVideo = () => {
    setMessage((prev) => ({ ...prev, videoUrl: "" }));
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);
      socketConnection.emit("seen", params.userId);
      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });
      socketConnection.on("message", (data) => {
        console.log("Received message data:", data);
        setAllMessage(data);
      });
    }
  }, [socketConnection, params.userId, user]);

  const handleOnChange = (e) => {
    const { value } = e.target;
    setMessage((prev) => ({ ...prev, text: value }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        console.log("Sending new message:", message);
        socketConnection.emit("new message", {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
        });
        setMessage({ text: "", imageUrl: "", videoUrl: "" });
      }
    }
  };

  return (
    <div className="bg-no-repeat bg-cover h-screen overflow-hidden">
      <header className="sticky top-0 h-16 bg-slate-100 flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p className="-my-2 text-sm">
              {dataUser.online ? (
                <span className="text-green-500">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="cursor-pointer hover:text-primary">
            <HiDotsVertical />
          </button>
        </div>
      </header>
      {/* send message */}
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col h-[600px] pt-3 m-3 pb-8 lg:m-10  md:p-2">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-slate-100 h-full p-4">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <section
                className="h-[calc(100vh-200px)] md:h-[calc(100vh-176px)] overflow-x-hidden overflow-y-scroll scrollbar relative rounded-lg bg-gray-300 bg-opacity-50"
               
              >
                <div className="flex flex-col gap-2 py-2 mx-2">
                  {allMessage.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                        user._id === msg?.msgByUserId
                          ? "ml-auto bg-teal-100"
                          : "bg-white"
                      }`}
                    >
                      <div className="w-full relative">
                        {msg?.imageUrl && (
                          <img
                            src={msg?.imageUrl}
                            className="w-full h-full object-scale-down"
                            alt="uploaded content"
                          />
                        )}
                        {msg?.videoUrl && (
                          <video
                            src={msg.videoUrl}
                            className="w-full h-full object-scale-down"
                            controls
                          />
                        )}
                      </div>
                      <p className="px-2">{msg.text}</p>
                      <p className="text-xs ml-auto w-fit">
                        {moment(msg.createdAt).format("hh:mm")}
                      </p>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {message.imageUrl && (
                  <div className="w-full  h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
                    <div
                      className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
                      onClick={handleClearUploadImage}
                    >
                      <IoClose size={30} />
                    </div>
                    <div className="bg-gradient-to-l from-[#4264fa] to-[#fc77fc] rounded-lg p-1 ">
                      <img
                        src={message.imageUrl}
                        alt="uploadImage"
                        className="aspect-square w-full h-full max-w-sm m-2 object-scale-down "
                      />
                    </div>
                  </div>
                )}

                {message.videoUrl && (
                  <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
                    <div
                      className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
                      onClick={handleClearUploadVideo}
                    >
                      <IoClose size={30} />
                    </div>
                    <div className="bg-gradient-to-l from-[#4264fa] to-[#fc77fc] rounded-lg p-1">
                      <video
                        src={message.videoUrl}
                        className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                        controls
                        muted
                        autoPlay
                      />
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
                    <Loading />
                  </div>
                )}
              </section>
            </div>

            <section className="h-12 bg-slate-200 rounded-full flex items-center px-4">
              <div className="relative">
                <button
                  onClick={handleUploadImageVideoOpen}
                  className="flex justify-center items-center w-9 h-9 rounded-full hover:bg-primary hover:text-white"
                >
                  <FaPlus size={18} />
                </button>

                {/**video and image */}
                {openImageVideoUpload && (
                  <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
                    <form>
                      <label
                        htmlFor="uploadImage"
                        className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                      >
                        <div className="text-primary">
                          <FaImage size={18} />
                        </div>
                        <p>Image</p>
                      </label>
                      <label
                        htmlFor="uploadVideo"
                        className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                      >
                        <div className="text-purple-500">
                          <FaVideo size={18} />
                        </div>
                        <p>Video</p>
                      </label>

                      <input
                        type="file"
                        id="uploadImage"
                        onChange={handleUploadImage}
                        className="hidden"
                      />

                      <input
                        type="file"
                        id="uploadVideo"
                        onChange={handleUploadVideo}
                        className="hidden"
                      />
                    </form>
                  </div>
                )}
              </div>

              {/**input box */}
              <form
                className="h-full w-full flex gap-2"
                
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                 
                  placeholder="Type your message..."
                  className="py-1 px-4 outline-none w-full h-full bg-slate-200 rounded-full"
                  value={message.text}
                  onChange={handleOnChange}
                />

                <button className="text-primary hover:text-secondary">
                  <IoMdSend size={24} />
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;

// <div className="flex h-screen antialiased text-gray-800">
//   <div className="flex flex-row h-full w-full overflow-x-hidden">
//     <div className="flex flex-col flex-auto h-full p-6">
//       <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
//         <div className="flex flex-col h-full overflow-x-auto mb-4">
//           <div className="flex flex-col h-full">hi</div>
//         </div>
//         <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
//           <div>
//             <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M14.752 11.168l-4.586-4.586a2 2 0 00-2.828 2.828l7.071 7.071a2 2 0 002.828 0l7.071-7.071a2 2 0 10-2.828-2.828l-4.586 4.586a1 1 0 01-1.414 0z"
//                 ></path>
//               </svg>
//             </button>
//           </div>
//           <form
//             className="h-full w-full flex gap-2"
//             onSubmit={handleSendMessage}
//           >
//             <input
//               type="text"
//               placeholder="Type here message..."
//               className="py-1 px-4 outline-none w-full h-full"
//               value={message.text}
//               onChange={handleOnChange}
//             />
//             <button className="text-primary hover:text-secondary">
//               <IoMdSend size={28} />
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

//     <div className="flex h-screen antialiased text-gray-800">
// {/* <div className="flex flex-row h-full w-full overflow-x-hidden">
// {/* body part */}
// <div className="flex flex-col flex-auto h-full p-6">
//   <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
//     <div className="flex flex-col h-full overflow-x-auto mb-4">
//       <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
//         <div
//           className="flex flex-col gap-2 py-2 mx-2"
//           ref={currentMessage}
//         >
//           {allMessage.map((msg, index) => (
//             <div
//               key={index}
//               className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
//                 user._id === msg?.msgByUserId
//                   ? "ml-auto bg-teal-100"
//                   : "bg-white"
//               }`}
//             >
//               <div className="w-full relative">
//                 {msg?.imageUrl && (
//                   <img
//                     src={msg?.imageUrl}
//                     className="w-full h-full object-scale-down"
//                     alt="uploaded content"
//                   />
//                 )}
//                 {msg?.videoUrl && (
//                   <video
//                     src={msg.videoUrl}
//                     className="w-full h-full object-scale-down"
//                     controls
//                   />
//                 )}
//               </div>
//               <p className="px-2">{msg.text}</p>
//               <p className="text-xs ml-auto w-fit">
//                 {moment(msg.createdAt).format("hh:mm")}
//               </p>
//             </div>
//           ))}
//         </div>

//         {message.imageUrl && (
//           <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
//             <div
//               className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
//               onClick={handleClearUploadImage}
//             >
//               <IoClose size={30} />
//             </div>
//             <div className="bg-white p-3">
//               <img
//                 src={message.imageUrl}
//                 alt="uploadImage"
//                 className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
//               />
//             </div>
//           </div>
//         )}

//         {message.videoUrl && (
//           <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
//             <div
//               className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
//               onClick={handleClearUploadVideo}
//             >
//               <IoClose size={30} />
//             </div>
//             <div className="bg-white p-3">
//               <video
//                 src={message.videoUrl}
//                 className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
//                 controls
//                 muted
//                 autoPlay
//               />
//             </div>
//           </div>
//         )}

//         {loading && (
//           <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
//             <Loading />
//           </div>
//         )}
//       </section>
//     </div>
//   </div>
// </div>
// </div>
// </div> */}
