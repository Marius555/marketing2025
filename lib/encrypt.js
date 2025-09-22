import { SignJWT } from "jose";



export async function encryptData(userData, timeToExpire) {
  try {
    const secret = new TextEncoder().encode(process.env.ENCRYTPION_KEY);

    const jwt = await new SignJWT({userId: userData})
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(timeToExpire)
      .sign(secret);

    return jwt
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt user data");
  }
}
