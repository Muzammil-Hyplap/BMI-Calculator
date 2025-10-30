import { Router } from "express";
import z from "zod";
import { successResp, validationErrorResp } from "../services/responses.js";
import { db } from "../db/index.js";
import { bmis } from "../db/schema.js";
import { desc, eq, gte, lte } from "drizzle-orm";

const router: Router = Router();

router.post("/", async (req, res) => {
    const result = bmiSchema.safeParse(req.body);

    if (!result.success || !result.data) {
        return res.json(validationErrorResp(result.error));
    }

    const formData = result.data;

    const bmi = Math.round(formData.weight / (formData.height * formData.height));

    await db.insert(bmis).values({
        userId: req.user.id,
        height: formData.height,
        weight: formData.weight,
        bmi,
    });

    return res.json(successResp("BMI calculated and stored successfully"));
});

router.get("/dashboard", async (req, res) => {
    const allBMIs = await db.select().from(bmis).where(eq(bmis.userId, req.user.id));

    return res.json(successResp("Dashboard fetched successfull", allBMIs));
});

router.get("/", async (req, res) => {
    const allBMIs = db.select().from(bmis);
    const { userId, sdRaw, edRaw } = req.query;
    const sd = sdRaw ? new Date(sdRaw.toString()): null;
    const ed = edRaw ? new Date(edRaw.toString()): null;

    if (userId) {
        allBMIs.where(eq(bmis.userId, userId.toString()));
    }

    if (sd) {
        allBMIs.where(gte(bmis.createdAt, sd));
    }

    if (ed) {
        allBMIs.where(lte(bmis.createdAt, ed));
    }

    allBMIs.orderBy(desc(bmis.createdAt));

    return res.json(successResp("All BMIs fetched successfull", await allBMIs));
});

export const bmiSchema = z.object({
    height: z.number().max(10000).min(0.1),
    weight: z.number().max(10000).min(0.1),
});

export default router;
