const Users = require("../models/onlineUsers");
const Chats = require("../models/chats");

const avatar =[
    "https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png",
    "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png",
    "https://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-512.png",
    "https://cdn0.iconfinder.com/data/icons/user-pictures/100/matureman1-512.png",
    "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/afro_woman_female_person-512.png",
    "https://cdn0.iconfinder.com/data/icons/user-pictures/100/maturewoman-3-512.png",
    "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/boy_person_avatar_kid-512.png"
];


module.exports = function(socket, io){
    socket.on("newuser", async({socketId, name})=>{
        const newUser = await Users.create({
            name,
            socketId
        })

        const user_list = await Users.find().skip(0).exec();

        const client = user_list.map((element)=>{
            return {id:element.socketId, name: element.name, image:avatar[Math.floor(Math.random() * avatar.length)]};
        })

        const Fullchats = await Chats.find();
        if(Fullchats.length == 0){
            await Chats.create({
                chats:[]
            })
        }

        //await io.fetchSockets() - Although we can get list from here
        // console.log(socket.request.session);

        io.emit("userAdded", {
            msg:"User Added",
            name: newUser.name, 
            client,
            chats:Fullchats[0]?.chats || [],
            socketId:socket.id
        })
    }) 
}