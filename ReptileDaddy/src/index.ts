import express, { Request, RequestHandler } from "express"
import { PrismaClient, Session, User  } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { engine } from "express-handlebars";
import path from "path";
dotenv.config();
const client = new PrismaClient(); // New Client called client 
const app = express();  // Express application called app

app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.json()); // app uses json
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser());
app.use(express.static('public'));
app.use(cors());


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

app.post("/signin",  async (req, res) => {
    const {email, password} = req.body as LoginBody;
    const user = await client.user.findFirst({
      where: {
        email,
      }
    });
    if (!user) {
      res.status(404).json({ message: "Invalid email or password" });
      return;
    }
  
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(404).json({ message: "Invalid email or password" });
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
      maxAge: 60000 * 10 * 6 * 24
    })
    res.send("<h1>Logged In</h1>")
  });
  
// sign up
app.post('/createUser', async (req, res) => {
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
    const user = await client.user.create({ data: { // create new user
        firstName,
        lastName,
        email,
        passwordHash,
        sessions: {
            create: [{
              sessionToken: v4()
            }]
          }
        },
        include: {
          sessions: true
        }
      });
      res.cookie("session-token", user.sessions[0].sessionToken, {
        httpOnly: true,
        maxAge: 60000 * 10 * 6 * 24
      });
    
        res.json({user});
    });

  

TODO: "Create Reptile"

type Reptile = {
    id: number,
    species: string,
    name: string,
    sex: string,
}

app.post('/reptile', async (req: RequestWithSession,res) => {
    const {species, name, sex} = req.body as Reptile;
    if(!req.user){
      res.sendStatus(401);
      return;
    }
    const reptile = await client.reptile.create({
        data: {
            species,
            name,
            sex,
            userId: req.user!.id,
    }});
    res.status(200).json({message: "Reptile Created"});
});

TODO: "Delete Reptile"
app.delete('/delrep', async (req: RequestWithSession, res) => {
  if(!req.user){
    res.sendStatus(401);
    return;
  }
    await client.reptile.deleteMany({
        where: {
            id: req.body.id,
            userId: req.user!.id,
        
    }});
    res.status(200).json({message: "Reptile has been deleted."})
});

TODO: "Update Reptile"
app.post('/uprep', async (req: RequestWithSession,res) => {
    
    const {species, name, sex} = req.body as Reptile;
    if(!req.user){
      res.sendStatus(401);
      return;
    }
    const reptile = await client.reptile.updateMany({
        where: {
            id: parseInt(req.query.id as string,10),
        },
        data: {
            species,
            name,
            sex,
        }
    });
    res.status(200).json({message: "Reptile Updated"})
});

TODO: "list all Reptiles"
app.get('/reptile', async (req: RequestWithSession,res) => {
  if(!req.user){
    res.sendStatus(401);
    return;
  }
    const reptiles = await client.reptile.findMany({
        where: {
            userId: req.user!.id,
        }
    })
    res.json({reptiles});
});

type FeedingSchedule = { 
    foodItem: string,
}

TODO: "Create feeding for Reptile"
app.post('/feed', async (req: RequestWithSession,res) => {
    const {foodItem} = req.body as FeedingSchedule;
    if(!req.user){
      res.sendStatus(401);
      return;
    }
    const feed = await client.feeding.create({
        data: {
            reptileId: parseInt(req.query.id as string, 10),
            foodItem,
        }
    })
    res.status(200).json({message: "Feeding Created"})
});

TODO: "List all Feedings for Reptile"
app.get('/feed', async (req: RequestWithSession,res) => {
  if(!req.user){
    res.sendStatus(401);
    return;
  }
    const feedings = await client.feeding.findMany({
        where: {
            reptileId: parseInt(req.query.id as string, 10),
        }
    })
    res.json({feedings});
});
type HusbandryRecords = {
    weight: string,
    length: string,
    temperature: string,
    humidity: string,
}
TODO: "Create HusbandryRecords"
app.post('/husbandry', async (req: RequestWithSession,res) => {
  if(!req.user){
    res.sendStatus(401);
    return;
  }
    const {weight, length, temperature, humidity} = req.body as HusbandryRecords;
    const husbandry = await client.husbandryRecord.create({
        data: {
            reptileId: parseInt(req.query.id as string, 10),
            weight: parseFloat(weight),
            length: parseFloat(length),
            temperature: parseFloat(temperature),
            humidity: parseFloat(humidity)
        }
    })
    res.status(200).json({message: "Husbandry Created"})
});

TODO: "List all HusbandryRecords for reptile"
app.get('/husbandry', async (req: RequestWithSession,res) => {
  if(!req.user){
    res.sendStatus(401);
    return;
  }
    const husbandry = await client.husbandryRecord.findMany({
        where: {
            reptileId: parseInt(req.query.id as string, 10),
        }
    })
    res.json({husbandry});
});
type Schedule = {
    type: string,
    description: string,
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean,
    sunday: boolean,
}

TODO: " create schedule for reptile"
app.post('/schedulerep', async (req: RequestWithSession,res) => {
  if(!req.user){
    res.sendStatus(401);
    return;
  }
    const {type, description, monday, tuesday, wednesday, thursday, friday, saturday, sunday} = req.body as Schedule;
    const schedule = await client.schedule.create({
        data: {
            type,
            description,
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
            reptileId: parseInt(req.query.reptileId as string, 10),
            userId: req.user!.id
    }});
    res.status(200).json({message: "Schedule Create"});
});
TODO: "list schedule for reptile"
app.get('/schedulerep', async (req: RequestWithSession,res) => {
  if(!req.user){
    res.sendStatus(401);
    return;
  }
    const schedules = await client.schedule.findMany({
        where: {
            reptileId: parseInt(req.query.reptileId as string, 10),
            userId: req.user!.id,
    }});
    res.json({ schedules })
});

app.post('/logout', async (req: RequestWithSession, res) => {
    await client.session.deleteMany({
        where: {
            userId: req.user!.id
        }
    });
    res.status(200).json({message: "Logged Out"});
});

TODO: "list user schedules"
app.get('/scheduleuser', async (req: RequestWithSession, res) => {
  if(!req.user){
    res.sendStatus(401);
    return;
  }
    let day = req.query.day;
    if (day === "monday"){
        const schedules = await client.schedule.findMany({
            where: {
                userId: req.user!.id,
                monday: true 
        }});
        res.json({schedules});
    }
    else if (day === "tuesday") {
        const schedules = await client.schedule.findMany({
            where: {
                userId: req.user!.id,
                tuesday: true 
        }});
        res.json({schedules});
    }else if (day === "wednesday") {
        const schedules = await client.schedule.findMany({
            where: {
                userId: req.user!.id,
                wednesday: true 
        }});
        res.json({schedules});
    }else if (day === "thursday") {
        const schedules = await client.schedule.findMany({
            where: {
                userId: req.user!.id,
                thursday: true 
        }});
        res.json({schedules});
    }else if (day === "friday") {
        const schedules = await client.schedule.findMany({
            where: {
                userId: req.user!.id,
                friday: true 
        }});
        res.json({schedules});
    }else if (day === "saturday") {
        const schedules = await client.schedule.findMany({
            where: {
                userId: req.user!.id,
                saturday: true 
        }});
        res.json({schedules});
    }else if (day === "sunday") {
        const schedules = await client.schedule.findMany({
            where: {
                userId: req.user!.id,
                sunday: true 
        }});
        res.json({schedules});
    }else{
        res.json({message: "No Schedules for Today"});
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
      if (req.path.match(/\.\w+$/)) {
        fetch(`${process.env.ASSET_URL}/${req.path}`).then((response) => {
          if (response.ok) {
            res.redirect(response.url);
          } else {
            // handle dev problems here
          }
        });
      } else {
        next();
      }
    })
  } else {
    app.use("/static", express.static(path.join(__dirname, "static")))
    // do prod things
  }
  
  
  app.get("/*", (req, res) => {
    if (process.env.NODE_ENV === "production") {
    //   res.render("app", {
    //     development: false,
    //     jsUrl: manifest["src/main.tsx"].file,
    //     cssUrl: manifest["src/main.css"].file
    //   })
    } else {
      res.render("app", {
        development: true,
        assetUrl: process.env.ASSET_URL,
      });
    }
  
  })

app.listen(3000, () => {
    console.log("Server Started");
});
