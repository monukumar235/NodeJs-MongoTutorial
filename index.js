
import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
const port = 80;

app.use(express.json());

const url = "mongodb://localhost:27017";
const dbName = 'WearTheCode';
const client = new MongoClient(url);

app.set('view engine','pug');

async function startServer(){
    try {
        await client.connect();
        console.log("Connect to dataBase");
        app.get("/data",async (req,res)=>{
            try {
                const db = client.db(dbName);
                const collection = db.collection('users');
                const data = await collection.find({}).toArray();
                console.log(data);
                res.render('base',{students:data});
            } catch (error) {
                console.log(error);
                res.status(500).send({error : "An Error Occured"});
            }
        })
    } catch (error) {
        console.log("Error Occured while connecting to database..");
    }
}

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`);
});

startServer();
