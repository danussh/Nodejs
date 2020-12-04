const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const app = express();
require("dotenv").config();

const dbname = "loginPortal";
const MongoClient = require("mongodb").MongoClient;
const port = process.env.PORT || 3000;
const  atlasUrl=
  "mongodb+srv://training:WUJMyPMB7rW9OP5F@guvi.k00x5.mongodb.net/loginPortal?retryWrites=true&w=majority";
app.use(bodyParser.json());
app.use(cors());
app.listen(port, () => console.log(`Running on port : ${port}`));

// Adds new user
app.post('/register', async (req, res) => {
    let connection;
    try {
        connection = await mongodb.connect(atlasUrl);
        let db = connection.db(dbname);
        req.body.randomPassword = "";
        let userData = await db.collection('users').findOne({ email: req.body.email });
        if (userData) {
            res.status(400).json({ message: 'user already exists' });
        }
        else {

            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(req.body.password, salt);
            req.body.password = hash;
            userData = await db.collection('users').insertOne(req.body);
            res.status(200).json({ message: 'user registered successfully' });
            await connection.close();
        }
    }

    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

//Api which displays all users
app.get('/users', async (req, res) => {
    let connection;
    try {
        connection = await mongodb.connect(atlasUrl);
        let db = connection.db(dbname);
        let userDta = await db.collection('users').find().toArray();
        res.json(userDta);
        connection.close();
    }
    catch (err) {
    
            console.log(err);
            res.status(500).json(err);
    
    }
})

//Login
app.post('/login', async (req, res) => {
    let connection;
    try {
        connection = await mongodb.connect(atlasUrl);
        let db = connection.db(dbname);
        let userEmail = await db.collection('users').findOne({ email: req.body.email });
        console.log(userEmail)
        if (userEmail) {
            let isValid = await bcrypt.compare(req.body.password, userEmail.password);
            if (isValid) {
                res.status(200).json({
                    message: "login success",
                 
                });
            }
            else {
                res.status(403).json({ message: 'Invalid password' });
            }
        }
        else {
            res.status(401).json({ message: 'email not registered' });
        }

    }
    catch (err) {
          console.log(err);
            res.status(500).json(err);
        
    }

})


//