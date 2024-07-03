const Users = require("../models/onlineUsers");
const Chats = require("../models/chats");

module.exports = (socket, io)=>{

    function getMessageTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;
        return formattedTime;
    } 

    socket.on("newmessage", async({message, socketId}) => {
        const user = await Users.findOne({socketId});

        const Fullchat = await Chats.find();

        Fullchat[0].chats.push({name:user.name, message, socketId, time:getMessageTime()});

        await Fullchat[0].save();

        io.emit("messagereceived", {message, name: user.name, socketId, time:getMessageTime()});
    })
}