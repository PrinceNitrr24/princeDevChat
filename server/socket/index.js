const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");
const ConversationModel = require("../models/ConversationModel");
const MessageModel = require("../models/MessageModel");
const getConversation = require("../helpers/getConversation");

const app = express();

/***socket connection */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

//online user
const onlineUser = new Map();

io.on("connection", async (socket) => {
  console.log("connect User ", socket.id);

  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      throw new Error("Token is missing.");
    }

    //current user details
    const user = await getUserDetailsFromToken(token);
    if (!user) {
      throw new Error("User not found or authentication failed.");
    }

    const userIdString = user._id.toString();
    //create a room
    socket.join(userIdString);
    onlineUser.set(userIdString, socket.id);

    io.emit("onlineUser", Array.from(onlineUser.keys()));

    socket.on("message-page", async (userId) => {
      console.log("userId", userId);
      const userDetails = await UserModel.findById(userId).select("-password");

      if (!userDetails) {
        throw new Error("User details not found.");
      }

      const payload = {
        _id: userDetails._id.toString(),
        name: userDetails.name,
        email: userDetails.email,
        profile_pic: userDetails.profile_pic,
        online: onlineUser.has(userId),
      };
      socket.emit("message-user", payload);

      //get previous message
      const getConversationMessage = await ConversationModel.findOne({
        $or: [
          { sender: user._id, receiver: userId },
          { sender: userId, receiver: user._id },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      socket.emit("message", getConversationMessage?.messages || []);
    });

    socket.on("new message", async (data) => {
      console.log("new message data:", data);

      if (!data || !data.sender || !data.receiver) {
        throw new Error("Invalid data for new message.");
      }

      //check conversation is available both user
      let conversation = await ConversationModel.findOne({
        $or: [
          { sender: data.sender, receiver: data.receiver },
          { sender: data.receiver, receiver: data.sender },
        ],
      });

      //if conversation is not available
      if (!conversation) {
        const createConversation = await ConversationModel({
          sender: data.sender,
          receiver: data.receiver,
        });
        conversation = await createConversation.save();
      }

      const message = new MessageModel({
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        msgByUserId: data.msgByUserId,
      });
      const saveMessage = await message.save();

      await ConversationModel.updateOne(
        { _id: conversation._id.toString() },
        { $push: { messages: saveMessage._id.toString() } }
      );

      const getConversationMessage = await ConversationModel.findOne({
        $or: [
          { sender: data.sender, receiver: data.receiver },
          { sender: data.receiver, receiver: data.sender },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      io.to(data.sender.toString()).emit(
        "message",
        getConversationMessage?.messages || []
      );
      io.to(data.receiver.toString()).emit(
        "message",
        getConversationMessage?.messages || []
      );

      //send conversation
      const conversationSender = await getConversation(data.sender.toString());
      const conversationReceiver = await getConversation(
        data.receiver.toString()
      );

      io.to(data.sender.toString()).emit("conversation", conversationSender);
      io.to(data.receiver.toString()).emit(
        "conversation",
        conversationReceiver
      );
    });

    socket.on("sidebar", async (currentUserId) => {
      console.log("current user", currentUserId);

      const conversation = await getConversation(currentUserId);

      socket.emit("conversation", conversation);
    });

    socket.on("seen", async (msgByUserId) => {
      let conversation = await ConversationModel.findOne({
        $or: [
          { sender: user._id, receiver: msgByUserId },
          { sender: msgByUserId, receiver: user._id },
        ],
      });

      const conversationMessageId = conversation?.messages || [];

      await MessageModel.updateMany(
        { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
        { $set: { seen: true } }
      );

      //send conversation
      const conversationSender = await getConversation(user._id.toString());
      const conversationReceiver = await getConversation(
        msgByUserId.toString()
      );

      io.to(user._id.toString()).emit("conversation", conversationSender);
      io.to(msgByUserId.toString()).emit("conversation", conversationReceiver);
    });

    //disconnect
    socket.on("disconnect", () => {
      onlineUser.delete(user._id.toString());
      console.log("disconnect user ", socket.id);
    });
  } catch (error) {
    console.error("Socket connection error:", error.message);
    socket.disconnect(true); // Disconnect the socket in case of error
  }
});

module.exports = {
  app,
  server,
};
