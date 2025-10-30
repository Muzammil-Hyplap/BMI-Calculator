import express from "express";
import session from "express-session";
import 'dotenv/config'
import { initializePassport } from "./services/authentication.js";
import passportLib from "passport";
import authRouter from "./routers/authRouter.js";
import bmiRouter from "./routers/bmiRouter.js";

const app = express();
const passport = initializePassport(passportLib);

app.use(express.json())
const appEnv = process.env.APP_ENV;
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: appEnv==='local' ? false : true },
}));

app.use("/api/v1", authRouter)

app.use(passport.authenticate('session'));
app.use('/api/v1/bmi', bmiRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});