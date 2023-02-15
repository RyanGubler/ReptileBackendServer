import express from "express"
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import cookieParser from "cookie-parser";

const client = new PrismaClient(); // New Client called client 
const app = express();  // Express application called app
app.use(express.json()); // app uses json

type UserBody = {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

// sign up
app.post('/users', async (req, res) => {
    const {firstName, lastName, email, password} = req.body as UserBody; // New user type with info from response\
    const passwordHash = await bcrypt.hash(password, 10); // hashed password
    const emailCheck = await client.user.findFirst({
        where: {
            email,
        }
    });
    if (emailCheck){
        res.json(`Email already in use`);
        return;
    }
    await client.user.create({ data: {
        firstName,
        lastName,
        email,
        passwordHash,
    }});
    res.json(`<h1> New User Created </h1>`);
});
TODO: "Create Reptile"
app.post('/createrep', (req,res) => {
});

TODO: "Delete Reptile"
app.post('/delrep', (req,res) => {

});

TODO: "Update Reptile"
app.post('/uprep', (req,res) => {

});

TODO: "list all Reptiles"
app.get('/listrep', (req,res) => {

});

TODO: "Create feeding for Reptile"
app.post('/feed', (req,res) => {

});

TODO: "List all Feedings for Reptile"
app.get('/listfeed', (req,res) => {

});

TODO: "Create HusbandryRecords"
app.post('/crehusrep', (req,res) => {

});

TODO: "List all HusbandryRecords for reptile"
app.get('/listhusrep', (req,res) => {

});

TODO: " create schedule for reptile"
app.post('/schrep',(req,res) => {

});

TODO: "list schedule for reptile"
app.get('/listschrep', (req,res) => {

});

TODO: "list user schedules"
app.get('/listschuser', (req,res) => {

});

app.listen(3000, () => {
    console.log("Server Started");
});
