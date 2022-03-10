const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema ({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    pseudo: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
});

module.exports = mongoose.model("Users", UserSchema);