
import express from 'express';
import { MongoClient } from 'mongodb';
import path from 'path';

const app = express();
const port = 80;

app.use(express.json());

const url = "mongodb://localhost:27017";
const dbName = "StudentDb";

app.set("view engine",'pug');

const client = new MongoClient(url);

let db;

async function connectTODb(){
    await client.connect();
    console.log("Connected to Server SuccessFully....");
    db = client.db(dbName);
}

app.get("/student", async (req,res)=>{
    connectTODb();
    const data = await db.collection('students').find({}).toArray();
    console.log(data);
    res.json(data);
});

// Rendering data in pug
app.get("/data", async (req,res)=>{
    connectTODb();
    const data = await db.collection('students').find({}).toArray();
    console.log(data);
    res.status(200).render("index",{students:data});
});


app.listen(port,()=>{
    console.log(`Server Started at port http://localhost:${port}`);
});
