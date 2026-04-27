import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'snapvior-secret-key-123'
);

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePasswords(password: string, hashed: string) {
  return await bcrypt.compare(password, hashed);
}

export async function createToken(payload: any, expiresIn: string = '24h') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function setAuthCookie(token: string, name: string = 'snapvior-token') {
  const configuredSameSite = (process.env.COOKIE_SAME_SITE || '').toLowerCase();
  const sameSite =
    configuredSameSite === 'none' || configuredSameSite === 'lax' || configuredSameSite === 'strict'
      ? (configuredSameSite as 'none' | 'lax' | 'strict')
      : process.env.NODE_ENV === 'production' && !!process.env.CORS_ORIGIN
        ? 'none'
        : 'lax';

  (await cookies()).set(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || sameSite === 'none',
    sameSite,
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}
