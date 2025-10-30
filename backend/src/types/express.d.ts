// src/types/express.d.ts

import type { users } from "../db/schema.ts";

declare global {
  namespace Express {
    interface User{
        id:string
    }
    interface Request{
        user:Express.User
    }
  }
}