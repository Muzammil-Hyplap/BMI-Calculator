import { Router } from "express";
import z from "zod";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { errorResp, successResp, validationErrorResp } from "../services/responses.js";
import { hashPassword } from "../services/authentication.js";
import passport from "passport";
import { eq } from "drizzle-orm";

const router: Router = Router();

router.post("/signup", async (req, res) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success || !result.data) {
        return res.json(validationErrorResp(result.error));
    }
    const formData = result.data;

    const password = await hashPassword(formData.password);
    await db.insert(users).values({
        fname: formData.fname,
        lname: formData.lname,
        email: formData.email,
        phone_no: formData.phone_no,
        password,
    });

    return res.json(successResp("User registered successfully"));
});

router.post("/signin", async (req, res, next) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success || !result.data) {
        return res.json(validationErrorResp(result.error));
    }

    passport.authenticate("local", (err: any, user: Express.User | false, info: any) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials" });

        req.logIn(user, async (err) => {
            if (err) return next(err);

            const [dbUser] = await db.select().from(users).where(eq(users.id, user.id));

            res.json(
                successResp("Login successful", {
                    phone_no: dbUser?.phone_no,
                    fname: dbUser?.fname,
                    lname: dbUser?.lname,
                    email: dbUser?.email,
                })
            );
        });
    })(req, res, next);
});

export const loginSchema = z.object({
    phone_no: z
        .string()
        .max(10)
        .regex(/^[0-9]{10}$/),
    password: z
        .string()
        .min(8)
        .max(16)
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$/),
});

export const registerSchema = z
    .object({
        fname: z.string().max(50),
        lname: z.string().max(50),
        email: z.email(),
        phone_no: z
            .string()
            .max(10)
            .regex(/^[0-9]{10}$/),
        password: z
            .string()
            .min(8)
            .max(16)
            .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$/),
        confirm_password: z.string(),
    })
    .superRefine((data, ctx) => {
        if (data.confirm_password !== data.password) {
            ctx.addIssue({
                code: "custom",
                message: "Passwords do not match",
                path: ["confirm_password"],
            });
        }
    });

export default router;
