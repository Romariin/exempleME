const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema ({
    email: {type: String, required: true},
    password: {type: String, required: true},
    pseudo: {type: String, required: true},
});

module.exports = mongoose.model("Users", UserSchema);