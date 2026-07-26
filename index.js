const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config({ quiet: true });
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


app.post("/organization", authMiddleware, async (req, res) => {

    const userId = req.userId;
    const title = req.body.title;
    const description = req.body.description;

    const newOrg = await organizationModel.create({
        title,
        description,
        admin : userId,
        members : []
    })

    res.json({
        message : "Organization Created Successfully",
        orgId : newOrg._id
    })

})


app.post("/add-members-to-organization", authMiddleware, async (req, res) => {

    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUsername = req.body.memberUsername;

    const organization = await organizationModel.findOne({
        _id : organizationId
    })


    if (!organization || organization.admin.toString() !== userId) {

        res.status(403).json({
            message : "Either organization doesn't exist or You are not admin of the organization"
        })
        return
    }

    const memberUser = await userModel.findOne({
        username : memberUsername
    })


    if (!memberUser) {

        res.status(403).json({
            message : "No Members Found"
        })
        return
    }

    await organizationModel.updateOne(
        { _id : organizationId },
        { $addToSet : { members : memberUser._id } }
    )

    res.json({
        message : "Member Added Successfully"
    })

});


app.get("/organization", authMiddleware, async (req, res) => {

    const userId = req.userId;
    const organizationId = req.query.organizationId;

    if (!organizationId) {
        res.status(400).json({
            message : "organizationId is required"
        })
        return
    }

    const organization = await organizationModel.findOne({
        _id : organizationId
    }).catch(() => null);

    if (!organization) {
        res.status(404).json({
            message : "Organization Not Found"
        })
        return
    }

    const isAdmin = organization.admin.toString() === userId;
    const isMember = organization.members.some(memberId => memberId.toString() === userId);

    if (!isAdmin && !isMember) {

        res.status(403).json({
            message : "You Are Not Part Of This Organization"
        })
        return
    }

    res.json({
        organization
    })


})


app.delete("/member", authMiddleware, async (req, res) => {

    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUsername = req.body.memberUsername;

    const organization = await organizationModel.findOne({
        _id : organizationId
    }).catch(() => null);

    if (!organization || organization.admin.toString() !== userId) {

        res.status(403).json({
            message : "Either organization doesn't exist or You are not admin of the organization"
        })
        return
    }

    const memberUser = await userModel.findOne({
        username : memberUsername
    })

    if (!memberUser) {

        res.status(404).json({
            message : "No Members Found"
        })
        return
    }

    await organizationModel.updateOne(
        { _id : organizationId },
        { $pull : { members : memberUser._id } }
    )

    res.json({
        message : "Member Removed Successfully"
    })

})


app.listen(3000, () => {
    console.log("Server is running on port 3000");
    
});
