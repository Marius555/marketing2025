"use server";
import { adminAction } from "./adminOrClient";
import { cookies } from "next/headers";
import { encryptData } from "../lib/encrypt";
// import { createLocalCookie } from "./createLocalCookie";

export async function LoginUser(data) {
  try {
    const email = await data.email.trim();
    const password = await data.password;

    const { account } = await adminAction();

    const session = await account.createEmailPasswordSession(email, password);
    const timeToExpire = new Date(session.expire);
    const user = session.userId;

    const jwt = await encryptData(user, timeToExpire);
    const cookieStore = await cookies();

    cookieStore.set("appSession", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: timeToExpire,
    });

     cookieStore.set("localSession", jwt, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: timeToExpire,
    });

    return { success: true, message: "User Created Successfull" };
  } catch (error) {
    return { success: false, message: error.message || "An error occurred" };
  }
}
