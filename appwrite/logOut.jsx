"use server"
import { clientAction } from "./adminOrClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function LogoutUser() {
    const cookieStore = await cookies();
    try {
        const sessionClient = await clientAction();
        
        if (sessionClient.success !== false) {
            const { account } = sessionClient;
            
            // Delete the current session from Appwrite
            await account.deleteSession('current');
        }
        cookieStore.delete("appSession");
        cookieStore.delete("localSession");
        
        return { success: true, message: "Logged out successfully" };
    } catch (error) {
        cookieStore.delete("appSession");
        cookieStore.delete("localSession");
        return { success: true, message: "Logged out successfully" };
    }
}

export async function LogoutAndRedirect() {
    await LogoutUser();
    redirect('/');
}