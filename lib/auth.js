import { cookies } from "next/headers";
import { decryptData } from "./decrypt";

export async function isUserLoggedIn() {
  try {
    const cookieStore = await cookies();
    const localSession = cookieStore.get("localSession");
    return !!localSession?.value;
  } catch (error) {
    console.error("Error checking auth status:", error);
    return false;
  }
}

export async function getAuthCookie() {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("appSession");
  } catch (error) {
    console.error("Error getting auth cookie:", error);
    return null;
  }
}

export async function getDecryptedUserId() {
  try {
    const cookieStore = await cookies();
    const appSession = cookieStore.get("appSession");

    if (!appSession?.value) {
      return null;
    }

    const userId = await decryptData(appSession.value);
    return userId;
  } catch (error) {
    console.error("Error decrypting user data:", error);
    return null;
  }
}