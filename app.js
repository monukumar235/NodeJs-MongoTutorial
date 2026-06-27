
import express from 'express';
import { MongoClient } from 'mongodb';
import path from 'path';

const app = express();
const port = 80;

app.use(express.json());

const url = "mongodb://localhost:27017";
const dbName = "StudentDb";

const client = new MongoClient(url);

app.set('view engine','pug');

app.get("/data",async (req,res)=>{
    try{
        await client.connect();
        console.log("Connected to server");

        const db = client.db(dbName);
        const collection = db.collection("students");
        const data = await collection.find({age :{$gte:25}}).toArray();
        console.log(data);
        res.render("index",{students : data});
        // res.json(data);
    }catch(error){
        console.log("An Error Occured" + error);
        res.status(500).send({error : "An Error Occured."});
    }
});

app.listen(port,()=>{
    console.log(`Server Started at port http://localhost:${port}`);
});
