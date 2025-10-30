import { decimal, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: varchar({ length: 50 })
        .primaryKey()
        .$defaultFn(() => {
            return crypto.randomUUID();
        }),
    fname: varchar({ length: 255 }).notNull(),
    lname: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    phone_no: varchar({ length: 255 }).notNull().unique(),
    avatar: varchar({ length: 255 }),
    password: varchar({ length: 255 }).notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
});

export const bmis = mysqlTable("bmis", {
    id: varchar({ length: 50 })
        .primaryKey()
        .$defaultFn(() => {
            return crypto.randomUUID();
        }),
    userId: varchar({ length: 50 })
        .notNull()
        .references(() => users.id),
    height: decimal({ scale: 2, precision: 7 }).notNull(),
    weight: decimal({ scale: 2, precision: 7 }).notNull(),
    bmi: decimal({ scale: 2, precision: 8 }).notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
});
