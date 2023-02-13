import express from "express"
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient(); // New Client called client 
const app = express();  // Express application called app
app.use(express.json()); // app uses json



app.get("/", (req,res) => {
    res.json(`<h1>Hello World! </h1>`)
    
});

app.listen(3000, () => {
    console.log("Server Started");
});