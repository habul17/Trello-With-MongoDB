const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();

app.use(express.json());



app.listen(3000);