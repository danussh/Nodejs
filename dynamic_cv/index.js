const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const port =  3000;
const app = express();
const dbURL =
  "mongodb+srv://training:WUJMyPMB7rW9OP5F@guvi.k00x5.mongodb.net/<dbname>?retryWrites=true&w=majority";
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.listen(port, () => console.log(`Running on port : ${port}`));

// add a skill 
app.post("/addskills", async (req, res) => {
  try {
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("portfolio");
    let data = await db.collection("skills").insertOne(req.body);
    res.status(200).json({ message: "skill created" });
    clientInfo.close();
  } catch (error) {
    console.log(error);
    res.send(500);
  }
});
//show skills 
app.get("/showskills", async (req, res) => {
  try {
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("portfolio");
    let data = await db.collection("skills").find().toArray();
    res.status(200).json( data );
    clientInfo.close();
  } catch (error) {
    console.log(error);
    res.send(500);
  }
});
//add work Experience
app.post("/addwork", async (req, res) => {
  try {
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("portfolio");
    let data = await db.collection("work").insertOne(req.body);
    res.status(200).json({ message: "work created" });
    clientInfo.close();
  } catch (error) {
    console.log(error);
    res.send(500);
  }
});
//show work experience
app.get("/showwork", async (req, res) => {
  try {
    let clientInfo = await mongoClient.connect(dbURL);
    let db = clientInfo.db("portfolio");
    let data = await db.collection("work").find().toArray();
    res.status(200).json({ data });
    clientInfo.close();
  } catch (error) {
    console.log(error);
    res.send(500);
  }
});
