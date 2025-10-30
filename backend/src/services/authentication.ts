import type passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt'

export const initializePassport = (passport: passport.PassportStatic) => {

    passport.use(
        new LocalStrategy({ usernameField: "phone_no" }, async (phone_no, password, done) => {
            try {
                const [user] = await db.select().from(users).where(eq(users.phone_no, phone_no));

                if (!user) return done(null, false, { message: "Phone number or password is incorrect" });

                const isPasswordCorrect = await comparePassword(password, user.password);

                if(!isPasswordCorrect) return done(null, false, { message: "Phone number or password is incorrect" });

                return done(null, {
                  id: user.id
                });
            } catch (err) {
                return done(err);
            }
        })
    );

    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user.id);
        });
    });

    passport.deserializeUser(function (id, cb) {
        process.nextTick(async function () {
            const [user] = await db.select().from(users).where(eq(users.id, id as string));
            console.log(user)

            if(user){
                const expUser:Express.User = {
                    id: user.id,
                }

                return cb(null, expUser);
            }

            return cb('User not found');
        });
    });

    return passport;
};

export async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
}
