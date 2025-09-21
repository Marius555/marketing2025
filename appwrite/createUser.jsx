"use server"

import { adminAction } from "./adminOrClient";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
// import { createLocalCookie } from "./createLocalCookie";

export async function createUser(data) {
    try {
        const email = await data.email.trim();
        const name = await email.split("@");
        const password = await data.password;
      
        const { account } = await adminAction();
      
        await account.create(ID.unique(), email, password, name[0]);
        const session = await account.createEmailPasswordSession(email, password);
        const cookieStore = await cookies()
        
        // Set appSession cookie
        cookieStore.set("appSession", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
          expires: new Date(session.expire)
        });

        // await createLocalCookie(session);
      
        return { success: true, message: "User Created Successfull" };
    } catch (error) {
        return { success: false, message: error.message || "An error occurred" };
    }
}