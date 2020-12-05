const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const app = express();
require("dotenv").config();
const nodemailer = require('nodemailer');
require("dotenv").config();
var randomStr = require("randomstring");

const dbname = "loginPortal";
const MongoClient = require("mongodb").MongoClient;
const port = 3000;
const  atlasUrl=process.env.URL;
  
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


//send mail

app.post('/sendMail', async (req, res) => {
    let connection = await mongodb.connect(atlasUrl);
    let db = connection.db(dbname);
    let userEmail = await db.collection('users').findOne({ email: req.body.email });
    console.log(userEmail)
    if (userEmail) {
        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.userEmail,
                pass: process.env.userPassword
            }
        });

        let randomPassCode = randomStr.generate(10);
        console.log(randomPassCode)
        let updated =await db.collection('users').updateOne({ email: req.body.email }, { $set: { randomPassword: randomPassCode } });
        console.log(updated)
        let mailDetails = {
            from: '1514027@saec.ac.in',
            to: req.body.email,
            subject: 'Reset Password !!!',
            html: `<p> the passcode is: ${randomPassCode} <a href="https://focused-benz-7f8713.netlify.app/">click to reset password</a>`
        };

        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                res.status(404).json(err);
            } else {
                res.status(200).json({ message: 'Email sent successfully' });
            }
        });
    }
    else {
        res.status(401).json({ message: 'user does not exist' })
    }
})

//update password
app.post('/updatePassword', async (req, res) => {

    try {
        let connection = await mongodb.connect(atlasUrl);
        let db = connection.db(dbname);
        let userEmail = await db.collection('users').findOne({ email: req.body.email });
        console.log(userEmail)
        if (userEmail) {
           
            if (userEmail.randomPassword == req.body.randomStr) {
                let hashedPwd = await bcrypt.hash(req.body.password, 10);
              let har=  await db.collection('users').updateOne({ email: req.body.email }, { $set: { password: hashedPwd } });
              console.log(har)
              let har1= await db.collection('users').updateOne({ email: req.body.email }, { $set: { randomPassword: '' } });
              console.log(har1)
                res.status(200).json({
                    message: "Password changed successfully", har,har1
                });
            }
            else {
                res.status(400).json({
                    message: "Reset passcode doesnt match",
                });
            }
        }
        else {
            res.status(403).json({ message: 'user does not exist' })
        }
    }
    catch (err) {
        res.status(404).json(err);
    }

})