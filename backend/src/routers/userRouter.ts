import { Router } from "express";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { errorResp, successResp } from "../services/responses.js";

const router:Router = Router();

router.get('/', async (req,res)=>{
    const [user] = await db.select().from(users).where(eq(users.id, req.user?.id));

    if(user){
        return res.json(successResp("User fetched successfully", user));
    }

    return res.json(errorResp("User not found"));
})

export default router;