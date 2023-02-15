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
    await client.user.create({ data: {
        firstName,
        lastName,
        email,
        passwordHash,
    }});

    res.json(`<h1> New User Created </h1>`);
});

app.get("/", (req,res) => {
    res.json(`<h1>Hello World! </h1>`);   
});

app.listen(3000, () => {
    console.log("Server Started");
});