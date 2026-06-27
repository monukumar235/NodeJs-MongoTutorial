
import express from 'express';
import { MongoClient } from 'mongodb';
import path from 'path';

const app = express();
const port = 80;

// middleware in express
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static('public'));

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
    const data = await db.collection('students').find({}).toArray();
    console.log(data);
    res.json(data);
});

// Rendering data in pug
app.get("/data", async (req,res)=>{
    const data = await db.collection('students').find({}).toArray();
    console.log(data);
    res.status(200).render("index",{students:data});
});

app.post("/add-student",async (req,res)=>{
    console.log(req.body);
    const staudentData = req.body;
    await db.collection("students").insertOne(staudentData);
    res.send(`<h3>Student Added Successfully</h3><a href="/form.html">GO Back</a>`)
})


app.listen(port,async ()=>{
     await connectTODb();
    console.log(`Server Started at port http://localhost:${port}`);
});
