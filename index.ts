import express from "express";
import { MongoClient, ObjectId } from "mongodb";

// import session from "express-session";

//express setup
const app = express();
app.set("view engine", "ejs");
app.set("port", 3000);
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

interface Personage {
    _id?:ObjectId,
    id:number,
    naam:string,
    foto:string,
    biografie:string,
    notities:string,
    stats:number[],
    gebruikteItems:string[]
}

let sessionPersonages:Personage[] = [];

/* app.use(session({
    secret: "Isgeheim",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}));

declare module 'express-session' {
    export interface SessionData {
        user: Profile
        successMessage?: string;
    }
} */



interface Profile {
    _id?: ObjectId,
    id: number,
    username: string,
    email: string,
    password: string
}

let profiles: Profile[] = [];

const uri = 'mongodb+srv://mohammedelk:mohammedElk@cluster0.7z5asz7.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri);

let clientConnection = async () => {
    try {
        await client.connect();
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}


// Tijdelijke profiel om te kunnen inloggen om frontend te bekijken bij aanpassingen
const profile1: Profile = {
    id: 1,
    username: "moben",
    email: "moben@gmail.com",
    password: "Moben123"
}

app.get("/", async (req, res) => {
    res.render("projects-landingpage");
});

app.get("/fortnite-landingpage", async (req, res) => {
    res.render("fortnite-landingpage");
});

app.get("/avatar-kiezen", async (req, res) => {
    // const jsonTest:any = await (await fetch("https://fortnite-api.com/v2/cosmetics/br/Character_PrismParticle")).json();
    // const personage1: Personage ={
    //     id:1,
    //     naam:"Test Personage",
    //     foto: jsonTest.data.images.icon,
    //     biografie: "test bio",
    //     notities: "test notities",
    //     stats: [5,7],
    //     gebruikteItems:["",""]
    // }

    res.render("avatar-kiezen", {sessionPersonages});
});

app.get("/blacklisted-personages", async (req, res) => {
    res.render("blacklisted-personages");
});

app.get("/detailed-avatar-page/:id", async (req, res) => {
    const sessionPersonageAvatarDetail: Personage = sessionPersonages[parseInt(req.params.id) -1];
    res.render("detailed-avatar-page", {sessionPersonageAvatarDetail});
});

app.get("/favoriete-personages", async (req, res) => {

    res.render("favoriete-personages", {sessionPersonages});
});

app.get("/detailed-favo-page/:id", async (req, res) => {
    // const jsonTest:any = await (await fetch("https://fortnite-api.com/v2/cosmetics/br/Character_PrismParticle")).json();
    // const personage1: Personage ={
    //     id:1,
    //     naam:"Test Personage",
    //     foto: jsonTest.data.images.icon,
    //     biografie: "test bio",
    //     notities: "test notities",
    //     stats: [5,7],
    //     gebruikteItems:["",""]
    // }
    const sessionPersonageFavoDetail: Personage = sessionPersonages[parseInt(req.params.id) -1];
    res.render("detailed-favo-page", {sessionPersonageFavoDetail});
});

app.get("/log-in", async (req, res) => {
    res.render("log-in");
});

app.post("/login", async (req, res) => {
    const uName = req.body.username;
    const password = req.body.password;

    profiles = await client.db("Fortnitedb").collection("users").find<Profile>({}).toArray();

    if (uName && password) {
        const user = profiles.find((profile) => profile.username === uName);
        if (user) {
            if (user.password === password) {
                res.redirect("/fortnite-landingpage");
            }
            else {
                res.render('login', {
                    profiles: profiles,
                    message: "Verkeerde wachtwoord!"
                })
            }
        }
    }
})

app.get("/sign-up", async (req, res) => {
    res.render("sign-up");
});

app.post("/signup", async (req, res) => {
    const uName = req.body.newusername;
    const newEmail = req.body.newemail;
    const newpassword = req.body.newpassword;
    const confirmPassword = req.body.confirmpassword;

    let nextId: number;

    let user: Profile;

    if (newpassword == confirmPassword && uName != "" && newEmail != "" && newpassword != "") {
        nextId = profiles.length + 1;
        user = {
            id: nextId++,
            username: uName,
            email: newEmail,
            password: confirmPassword
        }
        profiles.push(user);
        client.db("Fortnitedb").collection("users").insertOne(user);
        res.redirect("/log-in");
    } else {
        return res.status(404).send('Gebruiker niet gevonden');
    }
})

app.get("/error-page", async (req, res) => {
    res.render("error-page")
})

app.listen(app.get("port"), async () => {
    const personagesJSON:any = await (await fetch("https://fortnite-api.com/v2/cosmetics/br/search/all?type=outfit&hasFeaturedImage=true")).json();
    const personages: any[] = personagesJSON.data;
    function selectRandomPersonages(array: any[], numPersonages: number): any[] {
        const copiedArray = [...array];
        for (let i = copiedArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copiedArray[i], copiedArray[j]] = [copiedArray[j], copiedArray[i]];
        }
        return copiedArray.slice(0, numPersonages);
    }
    const randomPersonages = selectRandomPersonages(personages, 20);
    let idCount:number = 1;
    randomPersonages.forEach((personage)=>{
        let createPersonage:Personage ={
            id:idCount,
            naam:personage.name,
            foto:personage.images.featured,
            biografie:personage.description,
            notities: "Schrijf notities...",
            stats: [0,0],
            gebruikteItems: ["",""]
        }
        sessionPersonages.push(createPersonage);
        idCount++;
    })
    console.log(`Local url: http://localhost:${app.get("port")}`);
});