import express from "express";

//express setup
const app = express();
app.set("view engine", "ejs");
app.set("port", 3000);
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

interface Profile {
    id: number,
    username: string,
    email: string,
    password: string
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
    res.render("avatar-kiezen");
});

app.get("/blacklisted-personages", async (req, res) => {
    res.render("blacklisted-personages");
});

app.get("/detailed-avatar-page", async (req, res) => {
    res.render("detailed-avatar-page");
});

app.get("/favoriete-personages", async (req, res) => {
    res.render("favoriete-personages");
});

app.get("/detailed-favo-page", async (req, res) => {
    res.render("detailed-favo-page");
});

app.get("/log-in", async (req, res) => {
    res.render("log-in");
});

app.post("/login", async (req, res) => {
    const uName = req.body.username;
    const password = req.body.password;

    if (uName == profile1.username && password == profile1.password) {
        res.redirect("/fortnite-landingpage");
    }
})

app.get("/sign-up", async (req, res) => {
    res.render("sign-up");
});

app.get("/error-page", async (req, res) => {
    res.render("error-page")
})

app.listen(app.get("port"), async () => {
    console.log(`Local url: http://localhost:${app.get("port")}`);
});