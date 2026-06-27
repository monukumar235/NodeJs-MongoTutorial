
import express from 'express';
import { MongoClient ,ObjectId} from 'mongodb';
import path from 'path';

const app = express();
const port = 80;

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

app.put("/update-student/:id",async (req,res)=>{

    const id  = req.params.id;
    const newData = req.body;

    if(!ObjectId.isValid(id)){
        return res.status(400).json({error : "Id is not Valid"});
    }
    if(Object.keys(newData).length === 0){
        return res.status(400).json({error : "Data can not be empty...."});
    }

    const result = await db.collection('students').replaceOne(
        {_id : new ObjectId(id)},
        newData
    );
    console.log(result);
    if(result.matchedCount === 1){
        res.status(200).json({message : "Student data updated successfully...."});
    }
    else{
        res.status(404).json({message : "Student not found......"});
    }
});


app.patch("/update-student/:id", async (req,res)=>{
    const id = req.params.id;
    const updatedData = req.body;

    if(!ObjectId.isValid(id)){
        return res.status(400).json({error : "Id is Invalid.."});
    }
    
    if(Object.keys(updatedData).length === 0){
        return res.status(400).json({error : "Data can not be empty"});
    }

    const result = await db.collection('students').updateOne(
       { _id : new ObjectId(id)},
       {$set : updatedData}
    );

    if(result.matchedCount === 1){
        res.status(200).json({message : "Updated Successfully........"})
    }else{
           res.status(404).json({message : "Data not found"});
       }
})

app.delete("/delete-student/:id",async (req,res)=>{
    
    const id = req.params.id;

    if(!ObjectId.isValid(id)){
       return res.status(400).json({error : "StudentId is not Valid"});
    }
    const result = await db.collection('students').deleteOne({_id : new ObjectId(id)});
    

    if(result.deletedCount === 1){
        return res.status(200).json({message : "Deleted SuccessFully...."});
    }
    else{
        return res.status(404).json({message : "Student Not Found........."});
    }
})

app.listen(port,async ()=>{
    await connectToDb();
    console.log(`Server Started at port http://localhost:${port}`);
});
