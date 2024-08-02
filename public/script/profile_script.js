let socket= io();
const  Naam= document.querySelector("span").innerHTML;
socket.on('connect', () => {
    socket.emit("newuser", {socketId: socket.id, name:Naam});
});

socket.on("userAdded", ({msg, name, client, chats, socketId})=>{

    document.querySelector(".users-list").innerHTML = "";
    let div = document.createElement("div");

    client.forEach(element => {
        let user = `<div class="user">
                        <div class="user-avatar">
                            <img src=${element.image} alt="User Avatar">
                        </div>
                        <div class="user-info">
                            <div>
                                <h4>${element.name}</h4>
                                <p class="user-status online">Online</p>
                            </div>
                            ${element.id == socket.id ? "<div>🟢</div>" : ""}
                        </div>
                    </div>`;
        div.innerHTML += user;
    });

    document.querySelector(".users-list").innerHTML = div.innerHTML;
    document.querySelector(".online-count").innerHTML = "&nbsp" + client.length;


    //Chats Loading for new user

    let messageArea = document.querySelector(".messages");

    if(socket.id == socketId){

        let fragdiv = document.createElement("div");
        chats.forEach((element)=>{
            let chatContainer = document.createElement("div");
            let chat = document.createElement("div");
            chat.classList.add("chat");
    
            chatContainer.innerHTML = `<div class="chat">
                                            <div class="chat-header">
                                                <h4 class="user-name">${element.name}</h4>
                                            </div>
                                            <div class="chat-message">${element.message}</div>
                                            <div class="time">
                                                <h4 class="chat-time">${element.time}</h4>     
                                            </div>
                                        </div>`;
            chatContainer.classList.add("left");
            fragdiv.append(chatContainer);
        }) 
        messageArea.innerHTML = fragdiv.innerHTML; 
    }
    
})

socket.on("clientUpdate", (updatedClient)=>{

    document.querySelector(".users-list").innerHTML = "";
    let div = document.createElement("div");

    updatedClient.forEach(element => {
        let user = `<div class="user">
                        <div class="user-avatar">
                            <img src=${element.image} alt="User Avatar">
                        </div>
                        <div class="user-info">
                            <div>
                                <h4>${element.name}</h4>
                                <p class="user-status online">Online</p>
                            </div>
                            ${element.id == socket.id ? "<div>🟢</div>" : ""}
                        </div>
                    </div>`;
        div.innerHTML += user;
    });

    document.querySelector(".users-list").innerHTML = div.innerHTML;
    document.querySelector(".online-count").innerHTML = updatedClient.length;
})

socket.on("messagereceived", ({message, name, socketId, time})=>{
    document.querySelector(".send-message-value").value = "";
    let messageArea = document.querySelector(".messages");
    let chatContainer = document.createElement("div");
    let chat = document.createElement("div");
    chat.classList.add("chat");

    if(socket.id == socketId){
        chatContainer.innerHTML = `<div class="chat">
                                        <div class="chat-message">${message}</div>
                                        <div class="time">
                                            <h4 class="chat-time">${time}</h4>     
                                        </div>
                                    </div>`;
        chatContainer.classList.add("right");
    }
    else{
        chatContainer.innerHTML = `<div class="chat">
                                        <div class="chat-header">
                                            <h4 class="user-name">${name}</h4>
                                        </div>
                                        <div class="chat-message">${message}</div>
                                        <div class="time">
                                            <h4 class="chat-time">${time}</h4>     
                                        </div>
                                    </div>`;
        chatContainer.classList.add("left");
    }
    messageArea.append(chatContainer);
})

document.querySelector(".send-message").addEventListener("submit",(e)=>{
    e.preventDefault();
    const message = document.querySelector(".send-message-value").value;
    if(message.trim() != ""){
        socket.emit("newmessage",{
            message:message,
            socketId:socket.id
        }) 
    }
})