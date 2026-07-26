const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URI);


const userSchema = mongoose.Schema({
    username : String,
    password : String
})

const organizationSchema = mongoose.Schema({
    title : String,
    description : String,
    admin : mongoose.Types.ObjectId,
    members : [mongoose.Types.ObjectId]
})


const userModel = mongoose.model("users", userSchema);
const organizationModel = mongoose.model("organizations", organizationSchema);


module.exports = {
    userModel,
    organizationModel
}