import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import session from "express-session";
import MongoStore from "connect-mongo";
import { userInfo } from "os";

//mongoDb setup
const uri = 'mongodb+srv://mohammedelk:mohammedElk@cluster0.7z5asz7.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

//express setup
const app = express();
app.set("view engine", "ejs");
app.set("port", 3000);
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "Isgeheim",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: MongoStore.create({ client })
}));

declare module "express-session" {
    export interface SessionData {
        userId: number;
    }
}

interface Personage {
    _id?: ObjectId,
    id: number,
    naam: string,
    foto: string,
    biografie: string,
    notities: string,
    stats: number[],
    gebruikteItems: string[]
}

let sessionPersonages: Personage[] = [];

interface Profile {
    _id?: ObjectId,
    id: number,
    username: string,
    email: string,
    password: string,
    sessionPersonages: Personage[],
    favorietePersonages: Personage[],
    blacklistedPersonages: Personage[]
}

let profiles: Profile[] = [];

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
// const profile1: Profile = {
//     id: 1,
//     username: "moben",
//     email: "moben@gmail.com",
//     password: "Moben123"
// }

app.get("/", async (req, res) => {
    res.render("projects-landingpage");
});

app.get("/fortnite-landingpage", async (req, res) => {
    if (req.session.userId) {
        res.render("fortnite-landingpage");
    } else {
        res.redirect("sign-up");
    }
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
    if (req.session.userId) {
        const user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
        if (user) {
            res.render("avatar-kiezen", { sessionPersonages: user.sessionPersonages });
        }
    } else {
        res.redirect("sign-up");
    }
});

app.get("/blacklisted-personages", async (req, res) => {
    if (req.session.userId) {
        const user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
        res.render("blacklisted-personages", { blacklistedPersonages: user?.blacklistedPersonages });
    } else {
        res.redirect("sign-up");
    }
});


app.post("/blacklisten", async (req, res) => {
    const user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
    let blacklistedPersonage: Personage = JSON.parse(req.body.blacklistedPersonage);
    if (user) {
        blacklistedPersonage.id = user?.blacklistedPersonages.length + 1;
    }
    await client.db("Fortnitedb").collection("users").updateOne(
        { id: req.session.userId },
        { $addToSet: { blacklistedPersonages: blacklistedPersonage } }
    );


    // Ik probeer hier de blacklisted personage te verwijderen uit sessionpersoanges maar krijg telkens foutmelding!

    // await client.db("Fortnitedb").collection("users").updateOne(
    //     { id: req.session.userId },
    //     { $pull: { sessionPersonages: blacklistedPersonage } }
    // );


    res.redirect("blacklisted-personages");
});

//blacklisted personage verwijderen (werkt nog niet door foutmelding)
app.post("/verwijderen", async (req, res) => {
    const user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
    let blacklistedPersonage: Personage = JSON.parse(req.body.blacklistedPersonage);
    if (user) {
        // await client.db("Fortnitedb").collection("users").updateOne(
        //     { id: req.session.userId },
        //     { $pull: { blacklistedPersonages: blacklistedPersonage } }
        // );
    }
})


app.get("/detailed-avatar-page/:id", async (req, res) => {
    if (req.session.userId) {
        const user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
        if (user) {
            const sessionPersonageAvatarDetail: Personage = user.sessionPersonages[parseInt(req.params.id) - 1];
            res.render("detailed-avatar-page", { sessionPersonageAvatarDetail });
        }
    } else {
        res.redirect("sign-up");
    }
});

app.get("/favoriete-personages", async (req, res) => {
    if (req.session.userId) {
        const user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
        if (user) {
            res.render("favoriete-personages", { favorietePersonages: user.favorietePersonages });
        }
    } else {
        res.redirect("sign-up");
    }
});

app.post("/favoriet-toevoegen", async (req, res) => {
    const user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
    let favorietePersonage: Personage = JSON.parse(req.body.favorietePersonage);
    if (user) {
        favorietePersonage.id = user?.favorietePersonages.length + 1;
    }
    await client.db("Fortnitedb").collection("users").updateOne(
        { id: req.session.userId },
        { $addToSet: { favorietePersonages: favorietePersonage } }
    );
    res.redirect("avatar-kiezen");
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
    if (req.session.userId) {
        const user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
        if (user) {
            const favorietePersonageDetail: Personage = user.favorietePersonages[parseInt(req.params.id) - 1];
            res.render("detailed-favo-page", { favorietePersonageDetail });
        }
    } else {
        res.redirect("sign-up");
    }
});

app.get("/log-in", async (req, res) => {
    res.render("log-in");
});

app.post("/log-in", async (req, res) => {
    const uName = req.body.username;
    const password = req.body.password;

    profiles = await client.db("Fortnitedb").collection("users").find<Profile>({}).toArray();

    if (uName && password) {
        const user = profiles.find((profile) => profile.username === uName);
        if (user) {
            if (user.password === password) {
                req.session.userId = user.id;
                sessionPersonages = user.sessionPersonages;
                res.redirect("/fortnite-landingpage");
            }
            else {
                res.render('log-in', {
                    profiles: profiles,
                    message: "Verkeerde wachtwoord!"
                })
            }
        }
    }
})

app.get("/log-out", async (req, res) => {
    req.session.destroy(() => res.redirect("log-in"));
    sessionPersonages = [];
});

app.get("/sign-up", async (req, res) => {
    res.render("sign-up");
});

app.post("/sign-up", async (req, res) => {
    const uName = req.body.newusername;
    const newEmail = req.body.newemail;
    const newpassword = req.body.newpassword;
    const confirmPassword = req.body.confirmpassword;

    let nextId: number;

    let user: Profile;

    if (newpassword == confirmPassword && uName != "" && newEmail != "" && newpassword != "") {
        nextId = (await client.db("Fortnitedb").collection("users").find<Profile>({}).toArray()).length + 1;

        //nieuwe sessie personages aanmaken
        const personagesJSON: any = await (await fetch("https://fortnite-api.com/v2/cosmetics/br/search/all?type=outfit&hasFeaturedImage=true")).json();
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
        let idCount: number = 1;
        randomPersonages.forEach((personage) => {
            let createPersonage: Personage = {
                id: idCount,
                naam: personage.name,
                foto: personage.images.featured,
                biografie: personage.description,
                notities: "Schrijf notities...",
                stats: [0, 0],
                gebruikteItems: ["", ""]
            }
            sessionPersonages.push(createPersonage);
            idCount++;
        });

        user = {
            id: nextId,
            username: uName,
            email: newEmail,
            password: confirmPassword,
            sessionPersonages: sessionPersonages,
            favorietePersonages: [],
            blacklistedPersonages: []
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
    console.log(`Local url: http://localhost:${app.get("port")}`);
});