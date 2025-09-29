"use server"
import { Client, Account, Databases, Storage } from "node-appwrite";
import { cookies } from "next/headers";

export async function clientAction() {
  try {

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

    const cookieStore = await cookies(); // Wait for cookies to resolve
    const session = cookieStore.get("appSession");

    if (!session || !session.value) {
      return { success: false, message: "Failed to load session" };
    }

    client.setSession(session.value);

    const databases = new Databases(client);
    const storage = new Storage(client);

    return {
      get account() {
        return new Account(client);
      },
      get databases() {
        return databases;
      },
      get storage() {
        return storage;
      },
    };
  } catch (error) {
    console.error('❌ Client action initialization failed:', error);
    return { success: false, message: "Failed to initialize client" };
  }
}

export async function adminAction() {
  // Use DEV_KEY for development, APPWRITE_API_KEY for production
  const apiKey = process.env.NODE_ENV === 'development'
    ? process.env.DEV_KEY || process.env.APPWRITE_API_KEY
    : process.env.APPWRITE_API_KEY;

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
}