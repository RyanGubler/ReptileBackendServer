import express, { Request, RequestHandler } from "express"
import { PrismaClient, Session, User  } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import cookieParser from "cookie-parser";

const client = new PrismaClient(); // New Client called client 
const app = express();  // Express application called app
app.use(express.json()); // app uses json
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser());
app.use(express.static('public'));


type UserBody = {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

TODO: "Login"
type LoginBody = {
    email: string,
    password: string
}

type RequestWithSession = Request & {
    session?: Session
    user?: User
  }

  const authenticationMiddleware: RequestHandler = async (req: RequestWithSession, res, next) => {
    
    const sessionToken = req.cookies["session-token"] as string;

    if (sessionToken) {
      const session = await client.session.findFirst({
        where: {
          sessionToken,
        },
        include: {
          user: true
        }
      });
      if (session) {
        req.session = session;
        req.user = session.user;
      }
    }
    next();
  }
  
app.use(authenticationMiddleware);

app.post("/sessions", async (req, res) => {
    const {email, password} = req.body as LoginBody;
    const user = await client.user.findFirst({
        where: {
            email,
        }
    });
    if(!user){
        res.status(404).json({ message: "Incorrect email or password"});
        return;
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if(!passwordMatch){
        res.status(404).json({ message: "Incorrect email or password"})
        return;
    }
    const token = v4();
    const session = await client.session.create({
        data: {
            userId: user.id,
            sessionToken: token,
        }
    })
    res.cookie("session-token", session.sessionToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
    })
})

// sign up
app.post('/', async (req, res) => {
    const {firstName, lastName, email, password} = req.body as UserBody; // New user type with info from response\
    const passwordHash = await bcrypt.hash(password, 10); // hashed password
    const emailCheck = await client.user.findFirst({ // check if Email is already in use
        where: {
            email,
        }
    });
    if (emailCheck){
        res.json(`Email already in use`);
        return;
    }
    await client.user.create({ data: { // create new user
        firstName,
        lastName,
        email,
        passwordHash,
    }});
    res.json(`<h1> New User Created </h1>`);
});


TODO: "Create Reptile"

type Reptile = {
    species: string,
    name: string,
    sex: string,
}

app.post('/reptile', async (req: RequestWithSession,res) => {
    const {species, name, sex} = req.body as Reptile;
    await client.reptile.create({
        data: {
            species,
            name,
            sex,
            userId: req.user!.id,
    }});
});

TODO: "Delete Reptile"
app.post('/delrep', async (req: RequestWithSession, res) => {
    await client.reptile.delete({
        where: {
            id: req.body.id,
            userId: req.user!.id,
        
    }});
    res.json({message: "Reptile has been deleted."})
});

TODO: "Update Reptile"
app.post('/uprep', async (req: RequestWithSession,res) => {
    const {species, name, sex} = req.body as Reptile;
    const reptile = await client.reptile.update({
        where: {
            id: req.body.id,
            userId: req.user!.id,
        },
        data: {
            species,
            name,
            sex,
        }
    });
    res.json({reptile})
});

TODO: "list all Reptiles"
app.get('/reptile', async (req: RequestWithSession,res) => {
    const reptiles = await client.reptile.findMany({
        where: {
            userId: req.user!.id,
        }
    })
    res.json({reptiles})
});


TODO: "Create feeding for Reptile"
app.post('/feed', (req,res) => {

});

TODO: "List all Feedings for Reptile"
app.get('/feed', (req,res) => {

});

TODO: "Create HusbandryRecords"
app.post('/husbandry', (req,res) => {

});

TODO: "List all HusbandryRecords for reptile"
app.get('/husbandry', (req,res) => {

});

TODO: " create schedule for reptile"
app.post('/schedulerep',(req,res) => {

});

TODO: "list schedule for reptile"
app.get('/schedulerep', (req,res) => {

});

TODO: "list user schedules"
app.get('/sceduleuser', (req,res) => {

});

app.listen(3000, () => {
    console.log("Server Started");
});
