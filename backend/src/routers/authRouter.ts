import { Router, type Request } from "express";
import z from "zod";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { errorResp, successResp, validationErrorResp } from "../services/responses.js";
import { hashPassword } from "../services/authentication.js";
import passport from "passport";
import { eq, or } from "drizzle-orm";
import multer, { type FileFilterCallback } from 'multer';
import path from "path";
import fs from "fs";

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const router: Router = Router();

router.post("/signup", upload.single('avatar'), async (req, res) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success || !result.data) {
        return res.json(validationErrorResp(result.error));
    }

    const formData = result.data;

    const password = await hashPassword(formData.password);
    const prevUser = await db.select().from(users).where(or(eq(users.email, formData.email), eq(users.phone_no, formData.phone_no)))

    if (prevUser.length) {
        return res.json(errorResp('Either the phone number or email already exists'));
    }

    type User = typeof users.$inferInsert

    const values:User = {
        fname: formData.fname,
        lname: formData.lname,
        email: formData.email,
        phone_no: formData.phone_no,
        password,
        avatar:null,
        createdAt:new Date(),
        updatedAt:new Date(),
    }

    if (req.file) {
        const uploadDir = path.join(import.meta.dirname, '../../public', 'avatars');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const filePath = path.join(uploadDir, req.file.originalname);

        fs.writeFile(filePath, req.file.buffer, async (err) => {
            try {
                if (err) {
                    console.log('File Write Error \\/')
                    console.log(err)
                } else {
                    values.avatar = '/avatars/' + req.file?.originalname
                    await db.insert(users).values(values);
                }
            } catch (e) {
                console.log(e)
            }
        });
    } else {
        await db.insert(users).values(values);
    }


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
                    avatar: dbUser?.avatar,
                })
            );
        });
    })(req, res, next);
});

router.post('/signout', passport.authenticate('session'), async (req, res, next) => {
    req.logOut(function(err) {
        if (err) return next(err)
        res.json(successResp('Successfully Logged Out'));
    })
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
