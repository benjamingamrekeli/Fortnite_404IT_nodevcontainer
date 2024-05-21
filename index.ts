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
        successMessage?: string;
    }
}

interface Personage {
    _id?: ObjectId,
    id: number,
    naam: string,
    foto: string,
    avatar: string,
    biografie: string,
    notities: string,
    stats: number[],
    backpacks: string[],
    pickaxes: string[],
    emotes: string[],
    gliders: string[],
    gebruikteItems: string[],
    reden: string
}

let sessionPersonages: Personage[] = [];

interface Profile {
    _id?: ObjectId,
    id: number,
    username: string,
    email: string,
    password: string,
    avatar: string,
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

app.get("/", async (req, res) => {
    res.render("projects-landingpage");
});

app.get("/fortnite-landingpage", async (req, res) => {
    const user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
    if (req.session.userId) {
        res.render("fortnite-landingpage", { user });
    } else {
        res.redirect("sign-up");
    }
});

app.get("/avatar-kiezen", async (req, res) => {
    if (req.session.userId) {
        const user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
        if (user) {
            res.render("avatar-kiezen", { sessionPersonages: user.sessionPersonages, user });
        }
    } else {
        res.redirect("sign-up");
    }
});

app.post("/avatar-instellen", async (req, res) => {
    let user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
    const personage: Personage = JSON.parse(req.body.personage);
    if (user) {
        user.avatar = personage.avatar;
        await client.db("Fortnitedb").collection("users").updateOne(
            { id: req.session.userId },
            { $set: { avatar: user.avatar } }
        );
    }
    res.redirect("avatar-kiezen");
});

app.get("/blacklisted-personages", async (req, res) => {
    if (req.session.userId) {
        const user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
        res.render("blacklisted-personages", { blacklistedPersonages: user?.blacklistedPersonages, user });
    } else {
        res.redirect("sign-up");
    }
});


app.post("/blacklisten", async (req, res) => {
    let user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
    let blacklistedPersonage: Personage = JSON.parse(req.body.blacklistedPersonage);
    blacklistedPersonage.reden = req.body.blacklistReden;

    if (user) {
        blacklistedPersonage.id = user?.blacklistedPersonages.length + 1;
        user.sessionPersonages = user.sessionPersonages.filter(personage => personage.naam !== blacklistedPersonage.naam);
        //id's in volgorde zetten
        for (let i = 0; i < user.sessionPersonages.length; i++) {
            user.sessionPersonages[i].id = i + 1;
        }
        await client.db("Fortnitedb").collection("users").updateOne(
            { id: req.session.userId },
            { $set: { sessionPersonages: user.sessionPersonages } }
        );
    }

    await client.db("Fortnitedb").collection("users").updateOne(
        { id: req.session.userId },
        { $addToSet: { blacklistedPersonages: blacklistedPersonage } }
    );
    res.redirect("blacklisted-personages");
});

app.post("/verwijderen", async (req, res) => {
    let user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
    let blacklistedPersonage: Personage = JSON.parse(req.body.blacklistedPersonage);
    if (user) {
        user.blacklistedPersonages = user.blacklistedPersonages.filter(personage => personage.naam !== blacklistedPersonage.naam);
        user.sessionPersonages.push(blacklistedPersonage);
        //id's in volgorde zetten
        for (let i = 0; i < user.sessionPersonages.length; i++) {
            user.sessionPersonages[i].id = i + 1;
        }
        await client.db("Fortnitedb").collection("users").updateOne(
            { id: req.session.userId },
            { $set: { blacklistedPersonages: user.blacklistedPersonages } }
        );
        await client.db("Fortnitedb").collection("users").updateOne(
            { id: req.session.userId },
            { $set: { sessionPersonages: user.sessionPersonages } }
        );
    }
    res.redirect("blacklisted-personages");
});

app.post("/reden-aanpassen", async (req, res) => {
    // let user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
    // let blacklistedPersonage: Personage = JSON.parse(req.body.blacklistedPersonage);
    // if (user) {
    //     res.redirect(`/detailed-avatar-page/${blacklistedPersonage.id}`);
    // }
});

app.get("/detailed-avatar-page/:id", async (req, res) => {
    if (req.session.userId) {
        const user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
        if (user) {
            const sessionPersonageAvatarDetail: Personage = user.sessionPersonages[parseInt(req.params.id) - 1];
            res.render("detailed-avatar-page", { sessionPersonageAvatarDetail, user });
        }
    } else {
        res.redirect("sign-up");
    }
});

app.get("/favoriete-personages", async (req, res) => {
    if (req.session.userId) {
        const user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
        if (user) {
            res.render("favoriete-personages", { favorietePersonages: user.favorietePersonages, user });
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

app.post("/favoriet-verwijderen", async (req, res) => {
    let user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
    let favorietePersonage: Personage = JSON.parse(req.body.favorietePersonage);
    if (user) {
        user.favorietePersonages = user.favorietePersonages.filter(personage => personage.naam !== favorietePersonage.naam);
        //id's in volgorde zetten
        for (let i = 0; i < user.sessionPersonages.length; i++) {
            user.sessionPersonages[i].id = i + 1;
        }
        await client.db("Fortnitedb").collection("users").updateOne(
            { id: req.session.userId },
            { $set: { favorietePersonages: user.favorietePersonages } }
        );
    }
    res.redirect("favoriete-personages");
});

app.get("/detailed-favo-page/:id", async (req, res) => {
    if (req.session.userId) {
        const user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
        if (user) {
            const favorietePersonageDetail: Personage = user.favorietePersonages[parseInt(req.params.id) - 1];
            res.render("detailed-favo-page", { favorietePersonageDetail, user });
        }
    } else {
        res.redirect("sign-up");
    }
});

app.post("/gebruik-item/:id", async (req, res) => {
    let user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
    const item: string = req.body.item;

    if (user) {
        if (user.favorietePersonages[parseInt(req.params.id) - 1].gebruikteItems[0] == "/images/vraagteken.png") {
            user.favorietePersonages[parseInt(req.params.id) - 1].gebruikteItems[0] = item;
        } else if (user.favorietePersonages[parseInt(req.params.id) - 1].gebruikteItems[1] == "/images/vraagteken.png") {
            user.favorietePersonages[parseInt(req.params.id) - 1].gebruikteItems[1] = item;
        }
    }

    await client.db("Fortnitedb").collection("users").updateOne(
        { id: req.session.userId },
        { $set: { favorietePersonages: user?.favorietePersonages } }
    );
    res.redirect(`/detailed-favo-page/${req.params.id}`);
});

app.post("/verwijder-item/:id", async (req, res) => {
    let user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
    const item: number = parseInt(req.body.item);

    if (user) {
        user.favorietePersonages[parseInt(req.params.id) - 1].gebruikteItems[item] = "/images/vraagteken.png";
    }

    await client.db("Fortnitedb").collection("users").updateOne(
        { id: req.session.userId },
        { $set: { favorietePersonages: user?.favorietePersonages } }
    );
    res.redirect(`/detailed-favo-page/${req.params.id}`);
});

app.post("/win-lose/:id", async (req, res) => {
    let user: Profile | null = await client.db("Fortnitedb").collection("users").findOne<Profile>({ id: req.session.userId });
    const fightResult = req.body.fightResult;
    if (fightResult == "win") {
        if (user) {
            user.favorietePersonages[parseInt(req.params.id) - 1].stats[0]++;
        }
    } else if (fightResult == "lose") {
        if (user) {
            user.favorietePersonages[parseInt(req.params.id) - 1].stats[1]++;
        }
    }
    await client.db("Fortnitedb").collection("users").updateOne(
        { id: req.session.userId },
        { $set: { favorietePersonages: user?.favorietePersonages } }
    );
    res.redirect(`/detailed-favo-page/${req.params.id}`);
});

app.get("/log-in", async (req, res) => {
    const successMessage = req.session.successMessage;

    req.session.successMessage = "";

    res.render('log-in', {
        profiles: profiles,
        message: successMessage
    });
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
        const backpacksJSON: any = await (await fetch("https://fortnite-api.com/v2/cosmetics/br/search/all?type=backpack")).json();
        const pickaxesJSON: any = await (await fetch("https://fortnite-api.com/v2/cosmetics/br/search/all?type=pickaxe")).json();
        const emotesJSON: any = await (await fetch("https://fortnite-api.com/v2/cosmetics/br/search/all?type=emote")).json();
        const glidersJSON: any = await (await fetch("https://fortnite-api.com/v2/cosmetics/br/search/all?type=glider")).json();
        const personages: any[] = personagesJSON.data;
        const backpacks: any[] = backpacksJSON.data;
        const pickaxes: any[] = pickaxesJSON.data;
        const emotes: any[] = emotesJSON.data;
        const gliders: any[] = glidersJSON.data;
        // function selectRandomPersonages(array: any[], numPersonages: number): any[] {
        //     const copiedArray = [...array];
        //     for (let i = copiedArray.length - 1; i > 0; i--) {
        //         const j = Math.floor(Math.random() * (i + 1));
        //         [copiedArray[i], copiedArray[j]] = [copiedArray[j], copiedArray[i]];
        //     }
        //     return copiedArray.slice(0, numPersonages);
        // }
        function selectRandomItems(array: any[], numItems: number): any[] {
            const copiedArray = [...array];
            for (let i = copiedArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [copiedArray[i], copiedArray[j]] = [copiedArray[j], copiedArray[i]];
            }
            return copiedArray.slice(0, numItems);
        }

        const randomPersonages = selectRandomItems(personages, 20);

        let idCount: number = 1;
        randomPersonages.forEach((personage) => {
            const randomBackpacks = selectRandomItems(backpacks, 4);
            const randomPickaxes = selectRandomItems(pickaxes, 5);
            const randomEmotes = selectRandomItems(emotes, 3);
            const randomGliders = selectRandomItems(gliders, 4);

            let randomBackpacksImages: string[] = [];
            let randomPickaxesImages: string[] = [];
            let randomEmotesImages: string[] = [];
            let randomGlidersImages: string[] = [];

            randomBackpacks.forEach((randomBackpack) => {
                randomBackpacksImages.push(randomBackpack.images.icon);
            });
            randomPickaxes.forEach((randomPickaxe) => {
                randomPickaxesImages.push(randomPickaxe.images.icon);
            });
            randomEmotes.forEach((randomEmote) => {
                randomEmotesImages.push(randomEmote.images.icon);
            });
            randomGliders.forEach((randomGlider) => {
                randomGlidersImages.push(randomGlider.images.icon);
            });

            let createPersonage: Personage = {
                id: idCount,
                naam: personage.name,
                foto: personage.images.featured,
                avatar: personage.images.icon,
                biografie: personage.description,
                notities: "Schrijf notities...",
                stats: [Math.floor(Math.random() * (8 - 0 + 1) + 0), Math.floor(Math.random() * (8 - 0 + 1) + 0)],
                backpacks: randomBackpacksImages,
                pickaxes: randomPickaxesImages,
                emotes: randomEmotesImages,
                gliders: randomGlidersImages,
                gebruikteItems: ["/images/vraagteken.png", "/images/vraagteken.png"],
                reden: "Geen reden toegevoegd"
            }
            sessionPersonages.push(createPersonage);
            idCount++;
        });

        user = {
            id: nextId,
            username: uName,
            email: newEmail,
            password: confirmPassword,
            avatar: "/images/vraagteken.png",
            sessionPersonages: sessionPersonages,
            favorietePersonages: [],
            blacklistedPersonages: []
        }

        profiles = await client.db("Fortnitedb").collection("users").find<Profile>({}).toArray();

        let sameUsername = profiles.find((profile) => profile.username == user.username);
        let sameEmail = profiles.find((profile) => profile.email == user.email);

        if (sameUsername) {
            res.render('sign-up', {
                profiles: profiles,
                message: "Account met deze gebruikersnaam bestaat al!"
            })
        } else if (sameEmail) {
            res.render('sign-up', {
                profiles: profiles,
                message: "Account met deze email bestaat al!"
            })
        } else {
            profiles.push(user);
            client.db("Fortnitedb").collection("users").insertOne(user);
            req.session.successMessage = "Account succesvol aangemaakt! U kunt nu inloggen."
            req.session.save(() => res.redirect("/log-in"));
        }
    } else if (newpassword != confirmPassword) {
        res.render('sign-up', {
            profiles: profiles,
            message: "Wachtwoorden kloppen niet!"
        })
    }
})

app.get("/error-page", async (req, res) => {
    res.render("error-page")
})

app.listen(app.get("port"), async () => {
    console.log(`Local url: http://localhost:${app.get("port")}`);
});