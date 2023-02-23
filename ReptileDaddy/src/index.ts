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
      maxAge: 60000 * 10
    })
    res.send("<h1>Logged In</h1>")
  });
  
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
        maxAge: 60000 * 10
      });
    
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
    const reptile = await client.reptile.create({
        data: {
            species,
            name,
            sex,
            userId: req.user!.id,
    }});
    res.json({reptile});
});

TODO: "Delete Reptile"
app.post('/delrep', async (req: RequestWithSession, res) => {

    await client.reptile.deleteMany({
        where: {
            id: req.body.id,
            userId: req.user!.id,
        
    }});
    res.json({message: "Reptile has been deleted."})
});

TODO: "Update Reptile"
app.post('/uprep/:id', async (req: RequestWithSession,res) => {
    const {species, name, sex} = req.body as Reptile;
    const reptile = await client.reptile.updateMany({
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

type FeedingSchedule = { 
    feedingTime: string,
    foodItem: string,
}

TODO: "Create feeding for Reptile"
app.post('/feed', async (req: RequestWithSession,res) => {
    const {foodItem} = req.body as FeedingSchedule;
    const feed = await client.feeding.create({
        data: {
            reptileId: req.body.id,
            foodItem,
        }
    })
    res.json({feed})
});

TODO: "List all Feedings for Reptile"
app.get('/feed', async (req: RequestWithSession,res) => {
    const feedings = await client.feeding.findMany({
        where: {
            reptileId: req.body.id,
        }
    })
    res.json({feedings});
});
type HusbandryRecords = {
    reptileId: number,
    weight: number,
    length: number,
    temperature: number,
    humidity: number,
}
TODO: "Create HusbandryRecords"
app.post('/husbandry', async (req: RequestWithSession,res) => {
    const {reptileId, weight, length, temperature, humidity} = req.body as HusbandryRecords;
    const husbandry = await client.husbandryRecord.create({
        data: {
            reptileId,
            weight,
            length,
            temperature,
            humidity,
        }
    })
    res.json({husbandry})
});

TODO: "List all HusbandryRecords for reptile"
app.get('/husbandry', async (req: RequestWithSession,res) => {
    const husbandry = await client.husbandryRecord.findMany({
        where: {
            reptileId: req.body.reptileId,
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
            reptileId: req.body.reptileId,
            userId: req.user!.id,
    }});
    res.json ({schedule});
});


TODO: "list schedule for reptile"
app.get('/schedulerep', async (req: RequestWithSession,res) => {
    const schedules = await client.schedule.findMany({
        where: {
            reptileId: req.body.id,
            userId: req.user!.id,
    }});
    res.json({ schedules })
});

TODO: "list user schedules"
app.get('/sceduleuser', async (req: RequestWithSession,res) => {
    const schedules = await client.schedule.findMany({
        where: {
            userId: req.user!.id,
    }});
    res.json({schedules});
});

app.listen(3000, () => {
    console.log("Server Started");
});
