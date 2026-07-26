const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();
const { userModel, organizationModel } = require('./models');
const {authMiddleware} = require('./middleware')
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const userExist = await userModel.findOne({
        username,
        password
    })

    if (userExist) {
        res.status(403).json({
            message: "User Already Exist"
        })
        return;
    }

    const newUser = await userModel.create({
        username,
        password
    })

    res.json({
        message : "Sign Up Successful"
    })

})


app.post("/signin", async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const userExist = await userModel.findOne({
        username,
        password
    })

    if (!userExist) {
        res.status(403).json({
            message: "Invalid Credentials"
        })
        return;
    }

    const token = jwt.sign({userId : userExist._id}, process.env.JWT_SECRET);

    res.json({
        userId : userExist._id,
        message : "Sign In Successful",
        token
    })


})



app.listen(3000, () => {
    console.log("Server is running on port 3000");
    
});
