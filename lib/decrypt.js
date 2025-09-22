import { jwtVerify } from 'jose';


export async function decryptData(encryptedJWT) {
  try {
    const secret = new TextEncoder().encode(process.env.ENCRYTPION_KEY);

    const { payload } = await jwtVerify(encryptedJWT, secret,{
      algorithms: ['HS256'],
    });

    return payload;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt user data');
  }
}