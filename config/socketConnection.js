const messageschema = require("../schema/messageSchema");
const userschema = require("../schema/userschema");

const app = require('express')();
const httpServer = require('http').createServer(app);
const { Server } = require('socket.io');

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
var casual = require("casual");

let users = [];
let anonymousUsers = [];
var anonymousWaitingList = [];
var mappingtable=[];
let io;
const setupSocket = (server,socketPort) => {
  
  io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
  });
  
  httpServer.listen(socketPort, () => {
      console.log("Socket server is running at port ",socketPort);
  });
    
  io.on("connection", (socket) => {
   
    if (socket.handshake.query.type === "chat"){
          io.emit("getUser", users);    
          const addUser = (userId, socketId) => {
            const existingUserIndex = users.findIndex((user) => user.userId === userId);
            if (existingUserIndex !== -1) {
              // User already exists, update the socketId
              users[existingUserIndex].socketId = socketId;
            } else {
              // User doesn't exist, push a new user object
              users.push({ userId: userId, socketId: socketId });
            }
          };
          
          const removeUser = (socketId) => {
            users = users.filter((user) => user.socketId !== socketId);
          };
      
          const getUser = (userId) => {
            return users.find((user) => user.userId === userId);
          };
      
          const getRoom = async (roomId) => {
            const b = await messageschema.findOne({ _id: roomId });
            return b;
          };
      
          const generateRoomId = () => {
            return mongoose.Types.ObjectId().toString();
          };

          // module.exports.enquiryy =async (userId) => {
          //   console.log(1);
          //   const matchingUsers = users.filter((user) => user.userId === userId);
          //   if (matchingUsers.length > 0) {
          //     matchingUsers.forEach((user) => {
          //       const socketId = user.socketId;
          //       socket.emit("enquiry", socketId);
          //     });
          //     console.log(userId);
          //     return true;
          //   } else {
          //     return false;
          //   }
          // };

          socket.on("addUser", (userId) => {
            addUser(userId, socket.id);
            io.emit("getUser", users);
          });
      
          socket.on("sendMessage", async ({ senderId,receiverId,text, medialink='',roomId,msgType = "chat" }) => {
            const sender = senderId;
            const receiver = getUser(receiverId);
                          
                          let room;
                          room = await getRoom(roomId);

                          if (room) {
                              roomId = ObjectId(roomId);
                              // Save the message in the chat history
                              var chats = [
                                {
                                  user_id: senderId,
                                  message: text,
                                  messagetype: "chat",
                                  medialink:medialink,
                                },
                              ];
                              var chat_user = [receiverId, senderId];
                              await messageschema.updateOne({ _id: roomId }, { $push: { chats: chats } });
                              // Emit the message to the sender
                              io.to(sender.socketId).emit("messageSent", {
                                roomId,
                                senderId,
                                receiverId,
                                text,
                                medialink,
                                msgType,
                              });
                          }else {
                              roomId = generateRoomId();
                              // Save the message in the chat history
                              var chats = [
                                {
                                  user_id: senderId,
                                  message: text,
                                  medialink:medialink,
                                  messagetype: "chat",
                                },
                              ];
                              var chat_user = [receiverId, senderId];
                              const messageSchema = new messageschema({
                                _id: roomId,
                                chat_user: chat_user,
                                chats: chats,
                              });
                              await messageSchema.save();
                              // Emit the message to the sender
                              io.to(sender.socketId).emit("messageSent", {
                                roomId,
                                senderId,
                                receiverId,
                                text,
                                medialink,
                                msgType,
                              });
                          }

                          if (receiver) {
                            // Emit the message to the receiver
                            io.to(receiver.socketId).emit("messageReceived", {
                              roomId,
                              senderId,
                              receiverId,
                              text,
                              medialink,
                              msgType,
                            });
                          }

          });

          socket.on("disconnect", () => {
            removeUser(socket.id);
            io.emit("getUser", users);
          });
    } 
    else{
        socket.partner = null;
        socket.username = "anonymous-" + casual.username;
        io.emit("getAnonymousUsers", getAnonymousUsers());
        
        socket.on("init",async function (data) {
        
          const user = { id: socket.id, username: socket.username,msg:data.msg  ,datetime: data.datetime};
         
         
        // Check if the user already exists in the anonymousUsers array
        // const existingUserIndex = anonymousUsers.findIndex((u) => u.id === socket.id);

        const existingUserIndex = findUserIndexById(mappingtable, data.userId);

        console.log(existingUserIndex);
        if (existingUserIndex === 0) {
          io.emit("getAnonymousUsers", getAnonymousUsers());
          console.log("User exist in chat list");
          return;
        }
        else if (existingUserIndex === -1) {
          let r = await userschema.findOne({ _id: ObjectId(data.userId) }, { name: 1 }).exec();
          let mappingdata = { socketId: socket.id, username: socket.username, userId: data.userId, name: r.name };
          anonymousUsers.push(user);
          mappingtable.push(mappingdata);
        } else {
          // If the user already exists, update their data
          anonymousUsers[existingUserIndex] = user;
        }

          // let r = await userschema.findOne({ _id: ObjectId(data.userId) }, { name: 1 }).exec();
          // let mappingdata = { socketId: socket.id, username: socket.username, userId: data.userId, name: r.name };
          // anonymousUsers.push(user);
          // mappingtable.push(mappingdata);  

          socket.emit("init",{
            my_id: socket.id,
            my_username: socket.username,
            msg:data.msg,
            datetime: data.datetime
          });
          
          // After init, if anyone is available, the user is connected with the other user and both will get partner details
          if (anonymousWaitingList.length > 0) {
            
            const partnerSocketId = anonymousWaitingList.shift();
            if(partnerSocketId && partnerSocketId.id !==socket.id)
            {
                const partnerSocket = io.sockets.sockets.get(partnerSocketId.id);
                if (partnerSocket) {
                  console.log("1");
                  socket.partner = partnerSocketId.id;
                  partnerSocket.partner = socket.id;
                  socket.broadcast
                    .to(socket.partner)
                    .emit("partner", {
                      id: socket.id,
                      username: socket.username,
                      msg:data.msg,
                      datetime: data.datetime
                    }); // Emitting the partner's details to both users
                    console.log("2");
                  socket.emit("partner", {
                    id: socket.partner,
                    username: partnerSocket.username,
                    msg: partnerSocket.msg,
                    datetime: partnerSocket.datetime
                  });
                }
            }
          } else {
            console.log("else");
            socket.msg = data.msg;
            socket.datetime = data.datetime;
            anonymousWaitingList.push(user);
          }
          // Emitting get all user details
          io.emit("getAnonymousUsers", getAnonymousUsers());
        });
      
        socket.on("anonymousMessage", function (data) {
          var msg = data.msg;
          var datetime=data.datetime;
          var target = data.target;
          var source = socket.id;
          socket.broadcast.to(target).emit("to", msg,datetime);
          io.to(source).emit("from", msg,datetime);
        });
      
        socket.on("partner", function (packet) {
          socket.partner = packet.target;
            socket.broadcast
            .to(socket.partner)
            .emit("partner", {
              id: socket.id,
              username: socket.username,
              msg: packet.msg,
              datetime: packet.datetime
            });
          
          
        });
      
        socket.on("disconnected", function () {
          if (socket.partner != null) {
            console.log("1");
            socket.broadcast.to(socket.partner).emit("typing", false);
            const partnerSocket = io.sockets.sockets.get(socket.partner);
            if (partnerSocket) {
              if (!partnerSocket.isDisconnectingNowSent) {
                partnerSocket.emit(
                  "disconnectMsg",
                  "Your partner has disconnected. Refresh the page to chat again."
                );
                partnerSocket.isDisconnectingNowSent = true;
              }
              partnerSocket.partner = null;
            }
          }
          // Remove the disconnected client from the user lists
          anonymousUsers = anonymousUsers.filter((user) => user.id !== socket.id);
          anonymousWaitingList = anonymousWaitingList.filter((userId) => userId !== socket.id);
        
          // Send the updated user list to all connected clients
          io.emit("getAnonymousUsers", getAnonymousUsers());
        });

        socket.on("disconnect", function () {
          if (socket.partner != null) {
            console.log("1");
            socket.broadcast.to(socket.partner).emit("typing", false);
            const partnerSocket = io.sockets.sockets.get(socket.partner);
            if (partnerSocket) {
              if (!partnerSocket.isDisconnectingNowSent) {
                partnerSocket.emit(
                  "disconnectMsg",
                  "Your partner has disconnected. Refresh the page to chat again."
                );
                partnerSocket.isDisconnectingNowSent = true;
              }
              partnerSocket.partner = null;
            }
          }
          // Remove the disconnected client from the user lists
          anonymousUsers = anonymousUsers.filter((user) => user.id !== socket.id);
          anonymousWaitingList = anonymousWaitingList.filter((userId) => userId !== socket.id);
        
          // Send the updated user list to all connected clients
          io.emit("getAnonymousUsers", getAnonymousUsers());
        });
        
        socket.on("typing", function (data) {
          socket.broadcast.to(socket.partner).emit("typing", data);
        });
      
        socket.on("skip", function () {
          if (socket.partner != null) {
            // Disconnect from current partner
            //socket.broadcast.to(socket.partner).emit("typing", false);
            const partnerSocket = io.sockets.sockets.get(socket.partner);
            if (partnerSocket) {
              partnerSocket.partner = null;
              partnerSocket.emit(
                "skipped",
                "Your partner has skipped the chat. Refresh the page to find a new partner."
              );
              partnerSocket.isDisconnectingNowSent = true;
              anonymousUsers = anonymousUsers.filter((user) => user.id !== partnerSocket.id);
              console.log("======1=========");
              console.log(anonymousUsers);
            }
            socket.partner = null;
          }
          const currentuser= anonymousUsers.filter((user) => user.id == socket.id)[0] ;
          // Try to connect with a new available user
          if(currentuser){
            if (anonymousWaitingList.length > 0) {
              const partnerSocketId = anonymousWaitingList.shift();
              if(partnerSocketId && partnerSocketId.id !==socket.id)
              {
                  const partnerSocket = io.sockets.sockets.get(partnerSocketId.id);
                  if (partnerSocket) {
                    socket.partner = partnerSocketId.id;
                    partnerSocket.partner = socket.id;
                    console.log("=======2========");
                    console.log(socket.partner);
                    console.log("=======3========");
                    console.log(partnerSocket);
                    socket.broadcast
                      .to(socket.partner)
                      .emit("partner", {
                        id: socket.id,
                        username: socket.username,
                        msg:currentuser.msg,
                      });
                      // socket.broadcast
                      // .to(socket.id)
                      // .emit("partner", {
                      //   id: socket.partner,
                      //   username: partnerSocket.username,
                      //   msg:partnerSocketId.msg,
                      // });
                      anonymousUsers.push(partnerSocketId);
                    socket.emit("partner", {
                      id: socket.partner,
                      username: partnerSocket.username,
                      msg: partnerSocketId.msg,
                    });
                  }
              }
            } else {
              anonymousWaitingList.push(currentuser);
            }
          }
          
          // Emitting get all user details
          io.emit("getAnonymousUsers", getAnonymousUsers());
        });

        // New code for moving chat to inbox and communicating non-anonymously
        socket.on("moveToInbox", async (chatMessage) => {
            const {recipientId, message, senderId} = chatMessage;
           
            // Check if the recipient is online and available to receive the message
            const recipient = getAnonymousUsers(recipientId);
            if (recipient) {
              const recipientSocket = io.sockets.sockets.get(recipientId);
              const socketIdsToSearch = [recipientId,senderId];
              const userIds = getUserIdsBySocketIds(socketIdsToSearch, mappingtable);
              const firstuserid=userIds[0];
              const secconduserid=userIds[1];
          
              // Check if the users already have a chat room
              const existingRoom = await getExistingRoom(firstuserid,secconduserid);
              if (existingRoom) {
                // Users already have a chat room, no need to create a new one
                socket.emit("moveToInboxResponse", {
                  success: false,
                  error: "You both have already communicated non-anonymously.",
                  roomId: existingRoom,
                });
              } else {
                // Send a message to the recipient asking for permission to communicate non-anonymously 
                recipientSocket.emit("inboxRequest", { senderId, message });
              }
            } else {
              // Handle the case when the recipient is offline or unavailable
              socket.emit("moveToInboxResponse", {
                success: false,
                error: "Recipient is offline or unavailable.",
              });
            }
        });

        // Listen for 'inboxRequestResponse' event
        socket.on('inboxRequestResponse',async (response) => {
            const { senderId, receiverId, accept, message } = response;
            if (accept) {
              // here socketid came as userid so we find corresponding userid from mappingtable and replace it in a new array  
              const chats = [];
              for (const msg of message) {
                const { user_id, ...rest } = msg;
                const mapping = mappingtable.find((item) => String(item.socketId) === String(user_id));
                const userId = mapping ? mapping.userId : null;
                const name = mapping ? mapping.name : null;
                const modifiedMsg = { ...rest ,user_id: userId, name: name};
                chats.push(modifiedMsg);
              }
           

              const receiverSocket = io.sockets.sockets.get(receiverId);
              // Check if the users already have a chat room
              const socketIdsToSearch = [receiverId,senderId];
              const userIds = getUserIdsBySocketIds(socketIdsToSearch,mappingtable);
              const firstuserid=userIds[0];
              const secconduserid=userIds[1];
              const existingRoom =await getExistingRoom(firstuserid,secconduserid);

              if (existingRoom ) {
                // Users already have a chat room, no need to create a new one
                socket.emit('moveToInboxResponse', {
                  success: false,
                  error: 'You both have already communicated non-anonymously.',
                  roomId: existingRoom,
                });
              } else {
                    var messages = new messageschema({
                      chat_user:[firstuserid,secconduserid],
                      chats:chats
                      });
                    const idroom=await messages.save();
                    socket.emit('moveToInboxResponse', {
                      success: true,
                      roomId: idroom,
                    });
                    receiverSocket.emit('moveToInboxResponse', {
                      success: true,
                      roomId: idroom,
                    });
              }
            } else {
              // Handle the case when the recipient declines the request
              socket.emit('moveToInboxResponse', {
                success: false,
                error: 'Recipient declined the request.',
              });
            }
        });

        function findUserIndexById(usersArray, targetId) {
          console.log(usersArray);
          console.log(targetId);
          for (let i = 0; i < usersArray.length; i++) {
            if (usersArray[i].userId === targetId) {
              return i;  // Return the index if user is found
            }
          }
          return -1;  // Return -1 if user is not found
        }
        // Helper function to check if the users already have a chat room
        const getExistingRoom = async (senderUserId, recipientUserId) => {
          const room = await messageschema.findOne({
            $and: [
              { chat_user: senderUserId },
              { chat_user: recipientUserId }
            ]
          });          
          console.log(room);
          return room ? room._id.toString() : null;
        };

        function getAnonymousUsers() {
          return anonymousUsers.map((user) => ({ id: user.id, username: user.username }));
        }

        function getUserIdsBySocketIds(socketIds, mappingtable) {
          const userIds = [];
          for (const entry of mappingtable) {
            if (socketIds.includes(entry.socketId)) {
              userIds.push(entry.userId);
            }
          }
          return userIds;
        }

        function connectUsers() {
          if (anonymousWaitingList.length >= 2) {
            const partnerSocketId1 = anonymousWaitingList.shift();
            const partnerSocket1 = io.sockets.sockets.get(partnerSocketId1);
            const partnerSocketId2 = anonymousWaitingList.shift();
            const partnerSocket2 = io.sockets.sockets.get(partnerSocketId2);
            if (partnerSocket1 && partnerSocket2) {
              partnerSocket1.partner = partnerSocketId2;
              partnerSocket2.partner = partnerSocketId1;
              partnerSocket1.broadcast
                .to(partnerSocketId2)
                .emit("partner", {
                  id: partnerSocketId1,
                  username: partnerSocket1.username,
                  msg: partnerSocket1.msg,
                });
              partnerSocket2.broadcast
                .to(partnerSocketId1)
                .emit("partner", {
                  id: partnerSocketId2,
                  username: partnerSocket2.username,
                  msg: partnerSocket2.msg,
                });
            }
            connectUsers(); // Recursively connect any additional waiting users
          }
        }
        
        connectUsers();
    }
  });


    module.exports.enquiry =async (userId) => {
        const matchingUsers = users.filter((user) => user.userId === String(userId));
        if (matchingUsers.length > 0) {
            const socketId = matchingUsers[0].socketId;
            io.to(socketId).emit("enquiry", {
            });
          return true;
        } else {
          return false;
        }
    };

};

module.exports = setupSocket;