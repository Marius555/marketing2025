"use server";

import { adminAction } from "./adminOrClient";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { encryptData } from "@/lib/encrypt";

// Input validation functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  // At least 8 characters, at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

export async function createUser(data) {
  try {
    const email = data.email?.trim();
    const password = data.password;

    // Input validation
    if (!email || !validateEmail(email)) {
      return { success: false, message: "Please provide a valid email address" };
    }

    if (!password || !validatePassword(password)) {
      return { success: false, message: "Password must be at least 8 characters long and contain both letters and numbers" };
    }

    const name = email.split("@");

    const { account } = await adminAction();

    await account.create(ID.unique(), email, password, name[0]);
    const session = await account.createEmailPasswordSession(email, password);
    const cookieStore = await cookies();

    const timeToExpire = new Date(session.expire);
    const user = session.userId;

    const jwt = await encryptData(user, timeToExpire);
    // Set appSession cookie
    cookieStore.set("appSession", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === 'production',
      expires: timeToExpire
    });

    cookieStore.set("localSession", jwt, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === 'production',
      expires: timeToExpire,
    });

    return { success: true, message: "User Created Successfully", userId: user };
  } catch (error) {
    console.error("Create user error:", error);

    // Sanitize error messages - don't expose internal details
    if (error.message?.includes("user_already_exists") || error.message?.includes("already exists")) {
      return { success: false, message: "An account with this email already exists" };
    }

    return { success: false, message: "Failed to create account. Please try again." };
  }
}
