
import express from 'express';
import { MongoClient } from 'mongodb';
import path from 'path';

const app = express();
const port = 80;

// middleWare
app.use(express.json());

const url = "mongodb://localhost:27017";
const dbName = "StudentDb";

const client = new MongoClient(url);

app.set('view engine','pug');

let db;

 async function connectToDb(params) {
    await client.connect();
    console.log("Connecte to Database....");
    db = client.db(dbName);
}

app.get("/data",async (req,res)=>{
    const data = await db.collection('students').find().toArray();
    console.log(data);
    res.json(data);
});

app.post("/add-student",async (req,res)=>{
    const {name,age,email,city} = req.body;

    if(!name || !age || !email || !city){
        res.status(400).json({error : "Please Provide name,age,email,city properly..."});
    }

    const result = await db.collection('students').insertOne({name,age,email,city});
    res.status(201).json({message : "Student Added SuccessFully",studentId : result.insertedId});
})

app.listen(port,async ()=>{
    await connectToDb();
    console.log(`Server Started at port http://localhost:${port}`);
});
