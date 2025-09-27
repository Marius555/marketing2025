import { jwtVerify } from 'jose';

export async function decryptData(encryptedJWT) {
  try {
    if (!process.env.ENCRYPTION_KEY) {
      throw new Error("ENCRYPTION_KEY environment variable is required");
    }

    // Use direct key (Edge Runtime compatible)
    const secret = new TextEncoder().encode(process.env.ENCRYPTION_KEY);

    const { payload } = await jwtVerify(encryptedJWT, secret,{
      algorithms: ['HS256'],
    });

    return payload;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt user data');
  }
}