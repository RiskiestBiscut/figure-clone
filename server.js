import express from 'express'
import mongoose from "mongoose"
import passport from"passport"
import dotenv from 'dotenv'
import session from "express-session"
import MongoStore from "connect-mongo"
import flash from "express-flash"
import logger from "morgan"
import connectDB from "./config/db.js"

// import routes
import mainRoutes from './routes/main.js'

//Use .env file in config folder
dotenv.config({ path: "./config/config.env" });

// Passport config
// require("./config/passport")(passport);

//Connect To Database
connectDB();

const app = express()

//set up EJS
app.set("view engine", "ejs");

// static folder
app.use(express.static("public"));

// body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//logging
app.use(logger("dev"));


// set up sessions
app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.DB_STRING})
    })
  );

//passport
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());


//routes
app.use("/", mainRoutes);

//Server listening
const PORT = process.env.PORT || 2121

app.listen(PORT, () => {
    console.log(`Bing Bong, the server is running on port ${PORT}`)
})