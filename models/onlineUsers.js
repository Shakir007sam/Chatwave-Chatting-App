const mongoose = require("mongoose");
const {Schema} = require("mongoose");


const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    }, 

    socketId :{
        type:String,
        required: true
    },

    date:{
        type: Date, 
        default:Date.now
    }
})

module.exports = mongoose.model("onlineUsers", userSchema);