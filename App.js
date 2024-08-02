require('dotenv').config(); // Add this line at the top to load environment variables

const express = require("express");
const { createServer } = require("http");
const path = require("path");
const { Server } = require("socket.io");
const session = require('express-session');
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Use environment variables
const PORT = process.env.PORT || 4000;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_OPTIONS = process.env.DB_OPTIONS;
const SESSION_SECRET = process.env.SESSION_SECRET;

const sessionMiddleware = session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?${DB_OPTIONS}`
    })
});

app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    if (req.session.isLogin) {
        return res.redirect("/profile");
    }
    res.render("login");
});

app.post("/login", (req, res) => {
    const { name } = req.body;
    req.session.name = name;
    req.session.isLogin = true;
    res.redirect("/profile");
});

app.get("/profile", (req, res) => {
    if (!req.session.isLogin) {
        return res.redirect("/login");
    }
    res.render("profile", {
        name: req.session.name
    });
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) res.send(err);
        res.redirect("/");
    });
});

io.on("connection", (socket) => {
    require("./Socket/newUser")(socket, io);
    require("./Socket/newmessage")(socket, io);
    require("./Socket/disconnect")(socket, io);
});

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?${DB_OPTIONS}`)
.then(() => {
    httpServer.listen(PORT, () => {
        console.log("Server Running at Port", PORT);
    });
}).catch((err) => {
    console.log("Unable to connect", err);
});
