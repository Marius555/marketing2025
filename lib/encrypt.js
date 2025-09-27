import { SignJWT } from "jose";

export async function encryptData(userData, timeToExpire) {
  try {
    if (!process.env.ENCRYPTION_KEY) {
      throw new Error("ENCRYPTION_KEY environment variable is required");
    }

    // Use direct key (Edge Runtime compatible)
    const secret = new TextEncoder().encode(process.env.ENCRYPTION_KEY);

    const jwt = await new SignJWT({userId: userData})
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(timeToExpire)
      .sign(secret);

    return jwt
  } catch (error) {
    throw new Error("Failed to encrypt user data");
  }
}
