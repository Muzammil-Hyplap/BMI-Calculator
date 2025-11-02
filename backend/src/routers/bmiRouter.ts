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
        console.dir(result.error)
        return res.json(validationErrorResp(result.error));
    }

    const formData = result.data;

    const bmi = formData.weight / (formData.height*formData.height);

    await db.insert(bmis).values({
        userId: req.user.id,
        height: formData.height,
        weight: formData.weight,
        bmi,
    });

    return res.json(successResp("BMI calculated and stored successfully"));
});

router.get('/gen-bmi', async (req,res)=>{
    const id = req.user.id
    type BMIType = typeof bmis.$inferInsert

    const bmiData:BMIType[] = [
        {
            userId:id,
            bmi:"15.67",
            height:"1.2",
            weight:"47",
            createdAt:new Date('2025-02-20'),
            updatedAt:new Date('2025-02-20'),
        },
        {
            userId:id,
            bmi:"16",
            height:"1.2",
            weight:"48",
            createdAt:new Date('2025-04-20'),
            updatedAt:new Date('2025-04-20'),
        },
        {
            userId:id,
            bmi:"16",
            height:"1.2",
            weight:"48",
            createdAt:new Date('2025-05-20'),
            updatedAt:new Date('2025-05-20'),
        },
        {
            userId:id,
            bmi:"17",
            height:"1.2",
            weight:"52",
            createdAt:new Date('2025-06-20'),
            updatedAt:new Date('2025-06-20'),
        },
        {
            userId:id,
            bmi:"18",
            height:"1.2",
            weight:"54",
            createdAt:new Date('2025-08-20'),
            updatedAt:new Date('2025-08-20'),
        },
    ];

    await db.insert(bmis).values(bmiData);
    return res.json(successResp("Dummy BMI Data inserted"))
})

router.get("/dashboard", async (req, res) => {
    const allBMIs = await db.select().from(bmis).where(eq(bmis.userId, req.user.id));

    return res.json(successResp("Dashboard fetched successfull", allBMIs));
});

router.get("/", async (req, res) => {
    const allBMIs = db.select().from(bmis);
    const { userId, sdRaw, edRaw } = req.query;
    const sd = sdRaw ? new Date(sdRaw.toString()): null;
    const ed = edRaw ? new Date(edRaw.toString()): null;
    const limit = req.query?.limit;

    if (userId) {
        allBMIs.where(eq(bmis.userId, userId.toString()));
    }

    if (sd) {
        allBMIs.where(gte(bmis.createdAt, sd));
    }

    if (ed) {
        allBMIs.where(lte(bmis.createdAt, ed));
    }
    if(limit){
        allBMIs.limit(Number(limit))
    }

    allBMIs.orderBy(desc(bmis.createdAt));

    return res.json(successResp("All BMIs fetched successfull", await allBMIs));
});

export const bmiSchema = z.object({
    height: z.number().max(10000).min(0.1),
    weight: z.number().max(10000).min(0.1),
});

export default router;
