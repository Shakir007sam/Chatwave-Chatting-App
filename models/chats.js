const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const sharedDataSchema = new Schema({
    chats:[
        {
           type:Object,
           required:true
        }
    ]
});

module.exports = mongoose.model("chats", sharedDataSchema);