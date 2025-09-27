"use server";
import { adminAction } from "./adminOrClient";
import { cookies } from "next/headers";
import { encryptData } from "../lib/encrypt";
import { redirect } from "next/navigation";

// Input validation functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function LoginUser(data) {
  try {
    const email = data.email?.trim();
    const password = data.password;

    // Input validation
    if (!email || !validateEmail(email)) {
      return { success: false, message: "Please provide a valid email address" };
    }

    if (!password) {
      return { success: false, message: "Password is required" };
    }

    const { account } = await adminAction();

    const session = await account.createEmailPasswordSession(email, password);
    const timeToExpire = new Date(session.expire);
    const user = session.userId;

    const jwt = await encryptData(user, timeToExpire);
    const cookieStore = await cookies();

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Login: Setting cookies', {
        userId: user,
        expiresAt: timeToExpire,
        isSecure: process.env.NODE_ENV === 'production'
      });
    }

    cookieStore.set("appSession", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === 'production',
      expires: timeToExpire,
    });

     cookieStore.set("localSession", jwt, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === 'production',
      expires: timeToExpire,
    });

    return { success: true, message: "Login successful", userId: user };
  } catch (error) {
    console.error("Login error:", error);

    // Sanitize error messages - don't expose internal details
    if (error.message?.includes("invalid_credentials") || error.message?.includes("Invalid credentials")) {
      return { success: false, message: "Invalid email or password" };
    }

    if (error.message?.includes("user_not_found") || error.message?.includes("not found")) {
      return { success: false, message: "Invalid email or password" };
    }

    return { success: false, message: "Login failed. Please try again." };
  }
}
