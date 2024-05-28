"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongodb_1 = require("mongodb");
var express_session_1 = require("express-session");
var connect_mongo_1 = require("connect-mongo");
//mongoDb setup
var uri = 'mongodb+srv://mohammedelk:mohammedElk@cluster0.7z5asz7.mongodb.net/?retryWrites=true&w=majority';
var client = new mongodb_1.MongoClient(uri);
//express setup
var app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set("port", 3000);
app.use(express_1.default.static('public'));
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: "Isgeheim",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: connect_mongo_1.default.create({ client: client })
}));
var sessionPersonages = [];
var profiles = [];
var clientConnection = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, 3, 5]);
                return [4 /*yield*/, client.connect()];
            case 1:
                _a.sent();
                return [3 /*break*/, 5];
            case 2:
                e_1 = _a.sent();
                console.error(e_1);
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, client.close()];
            case 4:
                _a.sent();
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
app.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.render("projects-landingpage");
        return [2 /*return*/];
    });
}); });
app.get("/fortnite-landingpage", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, successMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.db("Fortnitedb").collection("users").findOne({ id: req.session.userId })];
            case 1:
                user = _a.sent();
                successMessage = req.session.successMessage;
                req.session.successMessage = "";
                if (req.session.userId) {
                    res.render("fortnite-landingpage", {
                        user: user,
                        message: successMessage
                    });
                }
                return [2 /*return*/];
        }
    });
}); });
app.get("/avatar-kiezen", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.userId) return [3 /*break*/, 2];
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").findOne({ id: req.session.userId })];
            case 1:
                user = _a.sent();
                if (user) {
                    res.render("avatar-kiezen", { sessionPersonages: user.sessionPersonages, user: user });
                }
                return [3 /*break*/, 3];
            case 2:
                res.redirect("sign-up");
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/avatar-instellen", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, personage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.db("Fortnitedb").collection("users").findOne({ id: req.session.userId })];
            case 1:
                user = _a.sent();
                personage = JSON.parse(req.body.personage);
                if (!user) return [3 /*break*/, 3];
                user.avatar = personage.avatar;
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").updateOne({ id: req.session.userId }, { $set: { avatar: user.avatar } })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                res.redirect("avatar-kiezen");
                return [2 /*return*/];
        }
    });
}); });
app.get("/blacklisted-personages", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.userId) return [3 /*break*/, 2];
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").findOne({ id: req.session.userId })];
            case 1:
                user = _a.sent();
                res.render("blacklisted-personages", { blacklistedPersonages: user === null || user === void 0 ? void 0 : user.blacklistedPersonages, user: user });
                return [3 /*break*/, 3];
            case 2:
                res.redirect("sign-up");
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/blacklisten", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, blacklistedPersonage, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.db("Fortnitedb").collection("users").findOne({ id: req.session.userId })];
            case 1:
                user = _a.sent();
                blacklistedPersonage = JSON.parse(req.body.blacklistedPersonage);
                if (req.body.blacklistReden == "") {
                    blacklistedPersonage.reden = blacklistedPersonage.reden;
                }
                else {
                    blacklistedPersonage.reden = req.body.blacklistReden;
                }
                if (!user) return [3 /*break*/, 3];
                blacklistedPersonage.id = (user === null || user === void 0 ? void 0 : user.blacklistedPersonages.length) + 1;
                user.sessionPersonages = user.sessionPersonages.filter(function (personage) { return personage.naam !== blacklistedPersonage.naam; });
                //id's in volgorde zetten
                for (i = 0; i < user.sessionPersonages.length; i++) {
                    user.sessionPersonages[i].id = i + 1;
                }
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").updateOne({ id: req.session.userId }, { $set: { sessionPersonages: user.sessionPersonages } })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, client.db("Fortnitedb").collection("users").updateOne({ id: req.session.userId }, { $addToSet: { blacklistedPersonages: blacklistedPersonage } })];
            case 4:
                _a.sent();
                res.redirect("blacklisted-personages");
                return [2 /*return*/];
        }
    });
}); });
app.post("/verwijderen", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, blacklistedPersonage, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.db("Fortnitedb").collection("users").findOne({ id: req.session.userId })];
            case 1:
                user = _a.sent();
                blacklistedPersonage = JSON.parse(req.body.blacklistedPersonage);
                if (!user) return [3 /*break*/, 4];
                user.blacklistedPersonages = user.blacklistedPersonages.filter(function (personage) { return personage.naam !== blacklistedPersonage.naam; });
                user.sessionPersonages.push(blacklistedPersonage);
                //id's in volgorde zetten
                for (i = 0; i < user.sessionPersonages.length; i++) {
                    user.sessionPersonages[i].id = i + 1;
                }
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").updateOne({ id: req.session.userId }, { $set: { blacklistedPersonages: user.blacklistedPersonages } })];
            case 2:
                _a.sent();
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").updateOne({ id: req.session.userId }, { $set: { sessionPersonages: user.sessionPersonages } })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                res.redirect("blacklisted-personages");
                return [2 /*return*/];
        }
    });
}); });
//haalt de detail avatar pagina op van een personage
app.get("/detailed-avatar-page/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, sessionPersonageAvatarDetail;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.userId) return [3 /*break*/, 2];
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").findOne({ id: req.session.userId })];
            case 1:
                user = _a.sent();
                if (user) {
                    sessionPersonageAvatarDetail = user.sessionPersonages[parseInt(req.params.id) - 1];
                    res.render("detailed-avatar-page", { sessionPersonageAvatarDetail: sessionPersonageAvatarDetail, user: user });
                }
                return [3 /*break*/, 3];
            case 2:
                res.redirect("sign-up");
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/favoriete-personages", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.userId) return [3 /*break*/, 2];
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").findOne({ id: req.session.userId })];
            case 1:
                user = _a.sent();
                if (user) {
                    res.render("favoriete-personages", { favorietePersonages: user.favorietePersonages, user: user });
                }
                return [3 /*break*/, 3];
            case 2:
                res.redirect("sign-up");
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/favoriet-toevoegen", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, favorietePersonage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.db("Fortnitedb").collection("users").findOne({ id: req.session.userId })];
            case 1:
                user = _a.sent();
                favorietePersonage = JSON.parse(req.body.favorietePersonage);
                if (user) {
                    favorietePersonage.id = (user === null || user === void 0 ? void 0 : user.favorietePersonages.length) + 1;
                }
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").updateOne({ id: req.session.userId }, { $addToSet: { favorietePersonages: favorietePersonage } })];
            case 2:
                _a.sent();
                res.redirect("avatar-kiezen");
                return [2 /*return*/];
        }
    });
}); });
app.post("/favoriet-verwijderen", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, favorietePersonage, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.db("Fortnitedb").collection("users").findOne({ id: req.session.userId })];
            case 1:
                user = _a.sent();
                favorietePersonage = JSON.parse(req.body.favorietePersonage);
                if (!user) return [3 /*break*/, 3];
                user.favorietePersonages = user.favorietePersonages.filter(function (personage) { return personage.naam !== favorietePersonage.naam; });
                //id's in volgorde zetten
                for (i = 0; i < user.sessionPersonages.length; i++) {
                    user.sessionPersonages[i].id = i + 1;
                }
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").updateOne({ id: req.session.userId }, { $set: { favorietePersonages: user.favorietePersonages } })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                res.redirect("favoriete-personages");
                return [2 /*return*/];
        }
    });
}); });
app.get("/detailed-favo-page/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, favorietePersonageDetail;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.userId) return [3 /*break*/, 2];
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").findOne({ id: req.session.userId })];
            case 1:
                user = _a.sent();
                if (user) {
                    favorietePersonageDetail = user.favorietePersonages[parseInt(req.params.id) - 1];
                    res.render("detailed-favo-page", { favorietePersonageDetail: favorietePersonageDetail, user: user });
                }
                return [3 /*break*/, 3];
            case 2:
                res.redirect("sign-up");
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/notities-opslaan/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, notities;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.db("Fortnitedb").collection("users").findOne({ id: req.session.userId })];
            case 1:
                user = _a.sent();
                notities = req.body.notities;
                if (user) {
                    user.favorietePersonages[parseInt(req.params.id) - 1].notities = notities;
                }
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").updateOne({ id: req.session.userId }, { $set: { favorietePersonages: user === null || user === void 0 ? void 0 : user.favorietePersonages } })];
            case 2:
                _a.sent();
                res.redirect("/detailed-favo-page/".concat(req.params.id));
                return [2 /*return*/];
        }
    });
}); });
app.post("/reden-aanpassen/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, reden;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.db("Fortnitedb").collection("users").findOne({ id: req.session.userId })];
            case 1:
                user = _a.sent();
                reden = req.body.reden;
                if (!user) return [3 /*break*/, 3];
                user.blacklistedPersonages[parseInt(req.params.id) - 1].reden = reden;
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").updateOne({ id: req.session.userId }, { $set: { blacklistedPersonages: user.blacklistedPersonages } })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                res.redirect("/blacklisted-personages");
                return [2 /*return*/];
        }
    });
}); });
app.post("/gebruik-item/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.db("Fortnitedb").collection("users").findOne({ id: req.session.userId })];
            case 1:
                user = _a.sent();
                item = req.body.item;
                if (user) {
                    if (user.favorietePersonages[parseInt(req.params.id) - 1].gebruikteItems[0] == "/images/vraagteken.png") {
                        user.favorietePersonages[parseInt(req.params.id) - 1].gebruikteItems[0] = item;
                    }
                    else if (user.favorietePersonages[parseInt(req.params.id) - 1].gebruikteItems[1] == "/images/vraagteken.png") {
                        user.favorietePersonages[parseInt(req.params.id) - 1].gebruikteItems[1] = item;
                    }
                }
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").updateOne({ id: req.session.userId }, { $set: { favorietePersonages: user === null || user === void 0 ? void 0 : user.favorietePersonages } })];
            case 2:
                _a.sent();
                res.redirect("/detailed-favo-page/".concat(req.params.id));
                return [2 /*return*/];
        }
    });
}); });
app.post("/verwijder-item/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.db("Fortnitedb").collection("users").findOne({ id: req.session.userId })];
            case 1:
                user = _a.sent();
                item = parseInt(req.body.item);
                if (user) {
                    user.favorietePersonages[parseInt(req.params.id) - 1].gebruikteItems[item] = "/images/vraagteken.png";
                }
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").updateOne({ id: req.session.userId }, { $set: { favorietePersonages: user === null || user === void 0 ? void 0 : user.favorietePersonages } })];
            case 2:
                _a.sent();
                res.redirect("/detailed-favo-page/".concat(req.params.id));
                return [2 /*return*/];
        }
    });
}); });
app.post("/win-lose/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, fightResult, blacklistedPersonage_1, i, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.db("Fortnitedb").collection("users").findOne({ id: req.session.userId })];
            case 1:
                user = _a.sent();
                fightResult = req.body.fightResult;
                if (fightResult == "win") {
                    if (user) {
                        user.favorietePersonages[parseInt(req.params.id) - 1].stats[0]++;
                    }
                }
                else if (fightResult == "lose") {
                    if (user) {
                        user.favorietePersonages[parseInt(req.params.id) - 1].stats[1]++;
                    }
                }
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").updateOne({ id: req.session.userId }, { $set: { favorietePersonages: user === null || user === void 0 ? void 0 : user.favorietePersonages } })];
            case 2:
                _a.sent();
                if (!user) return [3 /*break*/, 8];
                if (!(user.favorietePersonages[parseInt(req.params.id) - 1].stats[0] * 3 <= user.favorietePersonages[parseInt(req.params.id) - 1].stats[1])) return [3 /*break*/, 7];
                blacklistedPersonage_1 = user.favorietePersonages[parseInt(req.params.id) - 1];
                blacklistedPersonage_1.reden = "Drie keer meer verloren dan gewonnen.";
                if (!user) return [3 /*break*/, 5];
                blacklistedPersonage_1.id = (user === null || user === void 0 ? void 0 : user.blacklistedPersonages.length) + 1;
                user.favorietePersonages = user.favorietePersonages.filter(function (personage) { return personage.naam !== blacklistedPersonage_1.naam; });
                //id's favoriete persoanges in volgorde zetten
                for (i = 0; i < user.favorietePersonages.length; i++) {
                    user.favorietePersonages[i].id = i + 1;
                }
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").updateOne({ id: req.session.userId }, { $set: { favorietePersonages: user.favorietePersonages } })];
            case 3:
                _a.sent();
                user.sessionPersonages = user.sessionPersonages.filter(function (personage) { return personage.naam !== blacklistedPersonage_1.naam; });
                //id's persoanges in volgorde zetten
                for (i = 0; i < user.sessionPersonages.length; i++) {
                    user.sessionPersonages[i].id = i + 1;
                }
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").updateOne({ id: req.session.userId }, { $set: { sessionPersonages: user.sessionPersonages } })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [4 /*yield*/, client.db("Fortnitedb").collection("users").updateOne({ id: req.session.userId }, { $addToSet: { blacklistedPersonages: blacklistedPersonage_1 } })];
            case 6:
                _a.sent();
                res.redirect("/blacklisted-personages");
                return [3 /*break*/, 8];
            case 7:
                res.redirect("/detailed-favo-page/".concat(req.params.id));
                _a.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); });
app.get("/log-in", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var successMessage, isSuccess;
    return __generator(this, function (_a) {
        successMessage = req.session.successMessage;
        isSuccess = req.session.isSuccess;
        req.session.successMessage = "";
        req.session.isSuccess = null;
        res.render('log-in', {
            profiles: profiles,
            message: successMessage,
            isSuccess: isSuccess
        });
        return [2 /*return*/];
    });
}); });
app.post("/log-in", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var uName, password, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                uName = req.body.username;
                password = req.body.password;
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").find({}).toArray()];
            case 1:
                profiles = _a.sent();
                if (uName && password) {
                    user = profiles.find(function (profile) { return profile.username === uName; });
                    if (user) {
                        if (user.password === password) {
                            req.session.userId = user.id;
                            sessionPersonages = user.sessionPersonages;
                            req.session.successMessage = "Welkom ".concat(user.username, "! U bent succesvol ingelogd.");
                            res.redirect("/fortnite-landingpage");
                        }
                        else {
                            req.session.successMessage = "Verkeerde wachtwoord!";
                            req.session.isSuccess = false;
                            res.redirect("/log-in");
                        }
                    }
                    else {
                        req.session.successMessage = "Gebruiker bestaat niet!";
                        req.session.isSuccess = false;
                        res.redirect("/log-in");
                    }
                }
                return [2 /*return*/];
        }
    });
}); });
app.get("/log-out", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        req.session.destroy(function () { return res.redirect("log-in"); });
        sessionPersonages = [];
        return [2 /*return*/];
    });
}); });
app.get("/sign-up", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var successMessage;
    return __generator(this, function (_a) {
        successMessage = req.session.successMessage;
        req.session.successMessage = "";
        res.render("sign-up", {
            message: successMessage
        });
        return [2 /*return*/];
    });
}); });
app.post("/sign-up", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    // function selectRandomPersonages(array: any[], numPersonages: number): any[] {
    //     const copiedArray = [...array];
    //     for (let i = copiedArray.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));
    //         [copiedArray[i], copiedArray[j]] = [copiedArray[j], copiedArray[i]];
    //     }
    //     return copiedArray.slice(0, numPersonages);
    // }
    function selectRandomItems(array, numItems) {
        var _a;
        var copiedArray = __spreadArray([], array, true);
        for (var i = copiedArray.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [copiedArray[j], copiedArray[i]], copiedArray[i] = _a[0], copiedArray[j] = _a[1];
        }
        return copiedArray.slice(0, numItems);
    }
    var uName, newEmail, newpassword, confirmPassword, nextId, user, personagesJSON, backpacksJSON, pickaxesJSON, emotesJSON, glidersJSON, personages, backpacks_1, pickaxes_1, emotes_1, gliders_1, randomPersonages, idCount_1, sameUsername, sameEmail;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                uName = req.body.newusername;
                newEmail = req.body.newemail;
                newpassword = req.body.newpassword;
                confirmPassword = req.body.confirmpassword;
                if (!(newpassword == confirmPassword && uName != "" && newEmail != "" && newpassword != "")) return [3 /*break*/, 13];
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").find({}).toArray()];
            case 1:
                nextId = (_a.sent()).length + 1;
                return [4 /*yield*/, fetch("https://fortnite-api.com/v2/cosmetics/br/search/all?type=outfit&hasFeaturedImage=true")];
            case 2: return [4 /*yield*/, (_a.sent()).json()];
            case 3:
                personagesJSON = _a.sent();
                return [4 /*yield*/, fetch("https://fortnite-api.com/v2/cosmetics/br/search/all?type=backpack")];
            case 4: return [4 /*yield*/, (_a.sent()).json()];
            case 5:
                backpacksJSON = _a.sent();
                return [4 /*yield*/, fetch("https://fortnite-api.com/v2/cosmetics/br/search/all?type=pickaxe")];
            case 6: return [4 /*yield*/, (_a.sent()).json()];
            case 7:
                pickaxesJSON = _a.sent();
                return [4 /*yield*/, fetch("https://fortnite-api.com/v2/cosmetics/br/search/all?type=emote")];
            case 8: return [4 /*yield*/, (_a.sent()).json()];
            case 9:
                emotesJSON = _a.sent();
                return [4 /*yield*/, fetch("https://fortnite-api.com/v2/cosmetics/br/search/all?type=glider")];
            case 10: return [4 /*yield*/, (_a.sent()).json()];
            case 11:
                glidersJSON = _a.sent();
                personages = personagesJSON.data;
                backpacks_1 = backpacksJSON.data;
                pickaxes_1 = pickaxesJSON.data;
                emotes_1 = emotesJSON.data;
                gliders_1 = glidersJSON.data;
                randomPersonages = selectRandomItems(personages, 20);
                idCount_1 = 1;
                randomPersonages.forEach(function (personage) {
                    var randomBackpacks = selectRandomItems(backpacks_1, 4);
                    var randomPickaxes = selectRandomItems(pickaxes_1, 5);
                    var randomEmotes = selectRandomItems(emotes_1, 3);
                    var randomGliders = selectRandomItems(gliders_1, 4);
                    var randomBackpacksImages = [];
                    var randomPickaxesImages = [];
                    var randomEmotesImages = [];
                    var randomGlidersImages = [];
                    randomBackpacks.forEach(function (randomBackpack) {
                        randomBackpacksImages.push(randomBackpack.images.icon);
                    });
                    randomPickaxes.forEach(function (randomPickaxe) {
                        randomPickaxesImages.push(randomPickaxe.images.icon);
                    });
                    randomEmotes.forEach(function (randomEmote) {
                        randomEmotesImages.push(randomEmote.images.icon);
                    });
                    randomGliders.forEach(function (randomGlider) {
                        randomGlidersImages.push(randomGlider.images.icon);
                    });
                    var createPersonage = {
                        id: idCount_1,
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
                    };
                    sessionPersonages.push(createPersonage);
                    idCount_1++;
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
                };
                return [4 /*yield*/, client.db("Fortnitedb").collection("users").find({}).toArray()];
            case 12:
                profiles = _a.sent();
                sameUsername = profiles.find(function (profile) { return profile.username == user.username; });
                sameEmail = profiles.find(function (profile) { return profile.email == user.email; });
                if (sameUsername) {
                    req.session.successMessage = "Account met deze gebruikersnaam bestaat al!";
                    res.redirect("/sign-up");
                }
                else if (sameEmail) {
                    req.session.successMessage = "Account met deze email bestaat al!";
                    res.redirect("/sign-up");
                }
                else {
                    profiles.push(user);
                    client.db("Fortnitedb").collection("users").insertOne(user);
                    req.session.successMessage = "Account succesvol aangemaakt! U kunt nu inloggen.";
                    req.session.isSuccess = true;
                    req.session.save(function () { return res.redirect("/log-in"); });
                }
                return [3 /*break*/, 14];
            case 13:
                if (newpassword != confirmPassword) {
                    req.session.successMessage = "Wachtwoorden komen niet overeen!";
                    res.redirect("/sign-up");
                }
                _a.label = 14;
            case 14: return [2 /*return*/];
        }
    });
}); });
app.get("/error-page", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.render("error-page");
        return [2 /*return*/];
    });
}); });
app.listen(app.get("port"), function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("Local url: http://localhost:".concat(app.get("port")));
        return [2 /*return*/];
    });
}); });
