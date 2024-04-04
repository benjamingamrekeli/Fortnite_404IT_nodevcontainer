import express from "express";

//express setup
const app = express();
app.set("view engine", "ejs");
app.set("port", 3000);
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended:true}));


app.get("/", async(req, res) => {
    res.render("fortnite-landingpage");
});

app.get("/avatar-kiezen", async(req, res) => {
    res.render("avatar-kiezen");
});

app.get("/blacklisted-personages", async(req, res) => {
    res.render("blacklisted-personages");
});

app.get("/detailed-avatar-page", async(req, res) => {
    res.render("detailed-avatar-page");
});

app.get("/favoriete-personages", async(req, res) => {
    res.render("favoriete-personages");
});

app.get("/detailed-favo-page", async(req, res) => {
    res.render("detailed-favo-page");
});

app.get("/log-in", async(req, res) => {
    res.render("log-in");
});

app.get("/sign-up", async(req, res) => {
    res.render("sign-up");
});

app.listen(app.get("port"), async () => {
    console.log(`Local url: http://localhost:${app.get("port")}`);
});