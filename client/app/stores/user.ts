import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
    fname: string | null;
    lname: string | null;
    phone_no: string | null;
    email: string | null;
    avatar: string | null;
};

export type UserAction = {
    setUser: (user: User) => void;
    removeUser: () => void;
};

const useUser = create<User & UserAction>()(
    persist(
        (set) => ({
            fname: null,
            lname: null,
            phone_no: null,
            email: null,
            avatar: null,
            setUser: (user: User) => {
                set(user);
            },
            removeUser: () => {
                set({ fname: null, lname: null, phone_no: null, email: null, avatar: null });
            },
        }),
        { name: "user-storage" }
    )
);

export default useUser;
