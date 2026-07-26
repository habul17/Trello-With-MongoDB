const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();
const {userModel, organizationModel} = require('./models');
const app = express();

app.use(express.json());



app.listen(3000);